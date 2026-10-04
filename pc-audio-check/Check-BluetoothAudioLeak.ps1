<#
.SYNOPSIS
    이 PC의 소리가 근처 사람의 블루투스 이어폰(AirPods 등)으로 나갈 수 있는 경로가 있는지 점검합니다.

.DESCRIPTION
    읽기 전용 점검 스크립트입니다. 설정을 바꾸지 않습니다.
      1. 블루투스 어댑터 상태
      2. 페어링(등록)된 블루투스 기기와 연결 상태
      3. 블루투스 오디오 서비스(A2DP / 핸즈프리 / LE Audio)
      4. 오디오 출력 장치별로 지금 소리를 내는 프로그램
      5. 네트워크로 소리를 보내는 프로그램(AirPlay / Cast 등)
      6. 원격 데스크톱 세션(소리 전달 가능)
    마지막에 판정 요약을 출력합니다.

.PARAMETER ReportPath
    지정하면 화면 출력 전체를 이 텍스트 파일로도 저장합니다.

.EXAMPLE
    powershell -NoProfile -ExecutionPolicy Bypass -File .\Check-BluetoothAudioLeak.ps1
#>
[CmdletBinding()]
param(
    [string]$ReportPath
)

$ErrorActionPreference = 'SilentlyContinue'
try { [Console]::OutputEncoding = [Text.Encoding]::UTF8 } catch {}

if ($ReportPath) { Start-Transcript -Path $ReportPath -Force | Out-Null }

$findings = New-Object System.Collections.Generic.List[string]

function Write-Section([string]$title) {
    Write-Host ''
    Write-Host ('=' * 70) -ForegroundColor DarkGray
    Write-Host " $title" -ForegroundColor Cyan
    Write-Host ('=' * 70) -ForegroundColor DarkGray
}
function Write-Ok([string]$msg)   { Write-Host "  [안전] $msg" -ForegroundColor Green }
function Write-Warn([string]$msg) { Write-Host "  [주의] $msg" -ForegroundColor Yellow; $findings.Add($msg) }
function Write-Info([string]$msg) { Write-Host "  - $msg" }

# 블루투스 기기의 "연결됨" 속성 (DEVPKEY_Bluetooth 계열, Windows 10/11)
$BtConnectedKey = '{83DA6326-97A6-4088-9453-A1923F573B29} 15'

function Get-BtConnected([string]$instanceId) {
    $p = Get-PnpDeviceProperty -InstanceId $instanceId -KeyName $BtConnectedKey
    if ($null -eq $p -or $null -eq $p.Data) { return $null }
    return [bool]$p.Data
}

Write-Host ''
Write-Host '블루투스/무선 오디오 유출 경로 점검' -ForegroundColor White
Write-Host ("컴퓨터: {0}   사용자: {1}   시각: {2}" -f $env:COMPUTERNAME, $env:USERNAME, (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))

# ---------------------------------------------------------------------------
# 1. 블루투스 어댑터
# ---------------------------------------------------------------------------
Write-Section '1. 블루투스 어댑터'

$adapters = @(Get-PnpDevice -Class Bluetooth -PresentOnly |
    Where-Object { $_.InstanceId -match '^(USB|PCI|ACPI)\\' -and $_.FriendlyName -notmatch 'Enumerator|열거자|RFCOMM|LE Generic|Device Identification' })
$radioOn = $false
if ($adapters.Count -eq 0) {
    Write-Ok '블루투스 어댑터가 없거나 꺼져 있습니다. 블루투스로는 소리가 나갈 수 없습니다.'
} else {
    foreach ($a in $adapters) {
        Write-Info ("{0}  (상태: {1})" -f $a.FriendlyName, $a.Status)
        if ($a.Status -eq 'OK') { $radioOn = $true }
    }
    $svc = Get-Service -Name bthserv
    if ($svc) { Write-Info ("블루투스 지원 서비스(bthserv): {0}" -f $svc.Status) }
}

# ---------------------------------------------------------------------------
# 2. 페어링된 블루투스 기기
# ---------------------------------------------------------------------------
Write-Section '2. 페어링(등록)된 블루투스 기기'

$paired = @{}   # 이름 -> 연결 여부

# 2-a. 클래식 블루투스 페어링 목록 (레지스트리)
$regBase = 'HKLM:\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Devices'
foreach ($k in @(Get-ChildItem $regBase)) {
    $raw = (Get-ItemProperty -Path $k.PSPath -Name Name).Name
    $name = if ($raw) { ([Text.Encoding]::UTF8.GetString([byte[]]$raw)).Trim([char]0).Trim() } else { '(이름 없음)' }
    $mac = ($k.PSChildName -replace '(..)(?!$)', '$1:').ToUpper()
    if (-not $paired.ContainsKey($name)) { $paired[$name] = $null }
    Write-Info ("[클래식] {0}  ({1})" -f $name, $mac)
}

# 2-b. PnP 기준 (클래식 BTHENUM\DEV_ + 저전력 BTHLE\DEV_)
$btDevNodes = @(Get-PnpDevice | Where-Object { $_.InstanceId -match '^(BTHENUM|BTHLE)\\DEV_' })
foreach ($d in $btDevNodes) {
    $conn = Get-BtConnected $d.InstanceId
    $kind = if ($d.InstanceId -like 'BTHLE*') { 'LE' } else { '클래식' }
    $name = if ($d.FriendlyName) { $d.FriendlyName } else { $d.InstanceId }
    $paired[$name] = $conn
    $connText = switch ($conn) { $true { '연결됨' } $false { '연결 안 됨' } default { '알 수 없음' } }
    $line = "[{0}] {1}  -> {2}" -f $kind, $name, $connText
    if ($conn -eq $true) { Write-Warn "지금 연결된 블루투스 기기: $name" } else { Write-Info $line }
}

if ($paired.Count -eq 0) {
    Write-Ok '페어링된 블루투스 기기가 하나도 없습니다.'
    Write-Info '블루투스 이어폰은 이 PC와 "페어링"해야만 소리를 받을 수 있고, 페어링은 PC에서 직접 승인해야 합니다.'
}

# ---------------------------------------------------------------------------
# 3. 블루투스 오디오 서비스
# ---------------------------------------------------------------------------
Write-Section '3. 블루투스 오디오 서비스 (소리를 실제로 보내는 통로)'

$audioProfiles = [ordered]@{
    '0000110B' = 'A2DP 스테레오 음악 (이어폰으로 음악/영상 소리 전송)'
    '0000111E' = '핸즈프리 HFP (통화용 소리 전송)'
    '00001108' = '헤드셋 HSP (통화용 소리 전송)'
    '0000184E' = 'LE Audio 스트림 (ASCS)'
    '00001850' = 'LE Audio 기능 (PACS)'
    '00001852' = 'Auracast 방송 오디오'
}
$btAudioNodes = @(Get-PnpDevice | Where-Object {
    $id = $_.InstanceId
    ($id -match '^(BTHENUM|BTHLEDEVICE|BTHLE)\\') -and ($audioProfiles.Keys | Where-Object { $id -match $_ })
})
$btAudioActive = $false
if ($btAudioNodes.Count -eq 0) {
    Write-Ok '블루투스 오디오 서비스가 등록된 기기가 없습니다.'
} else {
    foreach ($n in $btAudioNodes) {
        $prof = ($audioProfiles.Keys | Where-Object { $n.InstanceId -match $_ } | Select-Object -First 1)
        $desc = $audioProfiles[$prof]
        $msg = "{0}  /  {1}  (상태: {2})" -f $n.FriendlyName, $desc, $n.Status
        if ($n.Status -eq 'OK') { $btAudioActive = $true; Write-Warn "블루투스 오디오 통로 활성: $msg" } else { Write-Info $msg }
    }
}

# ---------------------------------------------------------------------------
# 4. 오디오 출력 장치와 소리를 내는 프로그램
# ---------------------------------------------------------------------------
Write-Section '4. 오디오 출력 장치별로 지금 소리를 내는 프로그램'

$coreAudio = @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace AudioLeakCheck {
    [StructLayout(LayoutKind.Sequential)]
    public struct PROPERTYKEY { public Guid fmtid; public int pid; }

    [StructLayout(LayoutKind.Sequential)]
    public struct PROPVARIANT {
        public ushort vt; public ushort r1; public ushort r2; public ushort r3;
        public IntPtr p; public IntPtr p2;
    }

    [ComImport, Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDeviceEnumerator {
        [PreserveSig] int EnumAudioEndpoints(int dataFlow, int stateMask, out IMMDeviceCollection devices);
        [PreserveSig] int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice device);
    }

    [ComImport, Guid("0BD7A1BE-7A1A-44DB-8397-CC5392387B5E"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDeviceCollection {
        [PreserveSig] int GetCount(out int count);
        [PreserveSig] int Item(int index, out IMMDevice device);
    }

    [ComImport, Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IMMDevice {
        [PreserveSig] int Activate(ref Guid iid, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object iface);
        [PreserveSig] int OpenPropertyStore(int access, out IPropertyStore store);
        [PreserveSig] int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
        [PreserveSig] int GetState(out int state);
    }

    [ComImport, Guid("886D8EEB-8CF2-4446-8D02-CDBA1DBDCF99"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IPropertyStore {
        [PreserveSig] int GetCount(out int count);
        [PreserveSig] int GetAt(int index, out PROPERTYKEY key);
        [PreserveSig] int GetValue(ref PROPERTYKEY key, out PROPVARIANT value);
    }

    [ComImport, Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionManager2 {
        [PreserveSig] int GetAudioSessionControl(IntPtr sessionGuid, int flags, out IntPtr control);
        [PreserveSig] int GetSimpleAudioVolume(IntPtr sessionGuid, int flags, out IntPtr volume);
        [PreserveSig] int GetSessionEnumerator(out IAudioSessionEnumerator sessions);
    }

    [ComImport, Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionEnumerator {
        [PreserveSig] int GetCount(out int count);
        [PreserveSig] int GetSession(int index, [MarshalAs(UnmanagedType.IUnknown)] out object session);
    }

    [ComImport, Guid("BFB7FF88-7239-4FC9-8FA2-07C950BE9C6D"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioSessionControl2 {
        [PreserveSig] int GetState(out int state);
        [PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string name);
        [PreserveSig] int SetDisplayName(IntPtr a, IntPtr b);
        [PreserveSig] int GetIconPath(IntPtr a);
        [PreserveSig] int SetIconPath(IntPtr a, IntPtr b);
        [PreserveSig] int GetGroupingParam(IntPtr a);
        [PreserveSig] int SetGroupingParam(IntPtr a, IntPtr b);
        [PreserveSig] int RegisterAudioSessionNotification(IntPtr a);
        [PreserveSig] int UnregisterAudioSessionNotification(IntPtr a);
        [PreserveSig] int GetSessionIdentifier(IntPtr a);
        [PreserveSig] int GetSessionInstanceIdentifier(IntPtr a);
        [PreserveSig] int GetProcessId(out int pid);
        [PreserveSig] int IsSystemSoundsSession();
    }

    [ComImport, Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    interface IAudioMeterInformation {
        [PreserveSig] int GetPeakValue(out float peak);
    }

    [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
    class MMDeviceEnumeratorCom { }

    public class SessionInfo {
        public string Endpoint;
        public bool IsDefault;
        public int ProcessId;
        public string DisplayName;
        public string State;
        public float Peak;
    }

    public class EndpointInfo {
        public string Name;
        public bool IsDefault;
    }

    public static class Probe {
        [DllImport("ole32.dll")] static extern int PropVariantClear(ref PROPVARIANT pv);

        const int eRender = 0;
        const int eMultimedia = 1;
        const int DEVICE_STATE_ACTIVE = 1;
        const int CLSCTX_ALL = 23;

        static string Name(IMMDevice dev) {
            IPropertyStore store;
            if (dev.OpenPropertyStore(0, out store) != 0 || store == null) return "?";
            PROPERTYKEY key = new PROPERTYKEY();
            key.fmtid = new Guid("A45C254E-DF1C-4EFD-8020-67D146A850E0");
            key.pid = 14; // PKEY_Device_FriendlyName
            PROPVARIANT pv;
            if (store.GetValue(ref key, out pv) != 0) return "?";
            string s = (pv.vt == 31) ? Marshal.PtrToStringUni(pv.p) : "?";
            PropVariantClear(ref pv);
            return s;
        }

        static IMMDeviceEnumerator Enumerator() {
            return (IMMDeviceEnumerator)(new MMDeviceEnumeratorCom());
        }

        static string DefaultId(IMMDeviceEnumerator en) {
            IMMDevice def;
            string id = null;
            if (en.GetDefaultAudioEndpoint(eRender, eMultimedia, out def) == 0 && def != null) def.GetId(out id);
            return id;
        }

        public static List<EndpointInfo> Endpoints() {
            List<EndpointInfo> list = new List<EndpointInfo>();
            IMMDeviceEnumerator en = Enumerator();
            string defId = DefaultId(en);
            IMMDeviceCollection col;
            if (en.EnumAudioEndpoints(eRender, DEVICE_STATE_ACTIVE, out col) != 0) return list;
            int n; col.GetCount(out n);
            for (int i = 0; i < n; i++) {
                IMMDevice dev; col.Item(i, out dev);
                string id; dev.GetId(out id);
                EndpointInfo e = new EndpointInfo();
                e.Name = Name(dev);
                e.IsDefault = (id == defId);
                list.Add(e);
            }
            return list;
        }

        public static List<SessionInfo> Sessions() {
            List<SessionInfo> list = new List<SessionInfo>();
            IMMDeviceEnumerator en = Enumerator();
            string defId = DefaultId(en);
            IMMDeviceCollection col;
            if (en.EnumAudioEndpoints(eRender, DEVICE_STATE_ACTIVE, out col) != 0) return list;
            int n; col.GetCount(out n);
            Guid iidMgr = typeof(IAudioSessionManager2).GUID;
            for (int i = 0; i < n; i++) {
                IMMDevice dev; col.Item(i, out dev);
                string id; dev.GetId(out id);
                string epName = Name(dev);
                object o;
                if (dev.Activate(ref iidMgr, CLSCTX_ALL, IntPtr.Zero, out o) != 0 || o == null) continue;
                IAudioSessionManager2 mgr = (IAudioSessionManager2)o;
                IAudioSessionEnumerator se;
                if (mgr.GetSessionEnumerator(out se) != 0 || se == null) continue;
                int sc; se.GetCount(out sc);
                for (int j = 0; j < sc; j++) {
                    object so;
                    if (se.GetSession(j, out so) != 0 || so == null) continue;
                    IAudioSessionControl2 ctl = so as IAudioSessionControl2;
                    if (ctl == null) continue;
                    SessionInfo s = new SessionInfo();
                    s.Endpoint = epName;
                    s.IsDefault = (id == defId);
                    int st; ctl.GetState(out st);
                    s.State = st == 1 ? "Active" : (st == 0 ? "Inactive" : "Expired");
                    int pid; ctl.GetProcessId(out pid);
                    s.ProcessId = pid;
                    string dn; ctl.GetDisplayName(out dn);
                    s.DisplayName = dn;
                    IAudioMeterInformation meter = so as IAudioMeterInformation;
                    float pk = 0;
                    if (meter != null) meter.GetPeakValue(out pk);
                    s.Peak = pk;
                    list.Add(s);
                }
            }
            return list;
        }
    }
}
'@

$btNameHint = 'AirPods|Beats|Bluetooth|블루투스|Hands-Free|핸즈프리|Stereo|스테레오|Buds|LE Audio'
foreach ($n in $paired.Keys) { if ($n) { $btNameHint += '|' + [Regex]::Escape($n) } }

$coreOk = $false
try {
    if (-not ('AudioLeakCheck.Probe' -as [type])) { Add-Type -TypeDefinition $coreAudio -Language CSharp -ErrorAction Stop }
    $endpoints = [AudioLeakCheck.Probe]::Endpoints()
    $sessions  = [AudioLeakCheck.Probe]::Sessions()
    $coreOk = $true
} catch {
    Write-Info ("Windows 오디오 API를 읽지 못했습니다: {0}" -f $_.Exception.Message)
}

if ($coreOk) {
    Write-Host '  [사용 가능한 출력 장치]'
    foreach ($e in $endpoints) {
        $tag = if ($e.IsDefault) { ' (기본 출력)' } else { '' }
        if ($e.Name -match $btNameHint) {
            Write-Warn ("블루투스로 보이는 출력 장치: {0}{1}" -f $e.Name, $tag)
        } else {
            Write-Info ("{0}{1}" -f $e.Name, $tag)
        }
    }
    if ($endpoints.Count -eq 0) { Write-Info '활성 출력 장치가 없습니다.' }

    Write-Host ''
    Write-Host '  [출력 장치별 프로그램]  (Peak > 0 이면 지금 실제로 소리를 내는 중)'
    $rows = foreach ($s in $sessions) {
        if ($s.State -eq 'Expired') { continue }
        $proc = if ($s.ProcessId -eq 0) { '시스템 소리' } else {
            $p = Get-Process -Id $s.ProcessId
            if ($p) { "{0}.exe" -f $p.ProcessName } else { "PID $($s.ProcessId)" }
        }
        [pscustomobject]@{
            '출력 장치' = $s.Endpoint
            '프로그램'  = $proc
            'PID'       = $s.ProcessId
            '상태'      = $s.State
            'Peak'      = [math]::Round($s.Peak, 3)
        }
    }
    if ($rows) {
        $rows | Sort-Object '출력 장치', '프로그램' | Format-Table -AutoSize | Out-String -Width 200 | Write-Host
        foreach ($r in $rows) {
            if ($r.'출력 장치' -match $btNameHint -and $r.'상태' -eq 'Active') {
                Write-Warn ("'{0}' 의 소리가 블루투스 출력 장치 '{1}' 로 나가고 있습니다." -f $r.'프로그램', $r.'출력 장치')
            }
        }
    } else {
        Write-Info '현재 열린 오디오 세션이 없습니다.'
    }
}

# ---------------------------------------------------------------------------
# 5. 네트워크로 소리를 보내는 프로그램 (AirPlay / Cast 등)
# ---------------------------------------------------------------------------
Write-Section '5. 네트워크 오디오 전송 (AirPlay / Chromecast / DLNA 등)'
Write-Info 'AirPods 자체는 Wi-Fi로 받지 못하지만, 상대방 iPhone/Mac/Apple TV 로 AirPlay 전송되면 그 기기에 연결된 AirPods로 들을 수 있습니다.'

$streamApps = [ordered]@{
    'AirParrot'    = 'AirPlay 송신'
    'TuneBlade'    = 'AirPlay 송신'
    'Airfoil'      = 'AirPlay 송신'
    'AirServer'    = 'AirPlay 수신/미러링'
    'LonelyScreen' = 'AirPlay 수신'
    '5KPlayer'     = 'AirPlay/DLNA'
    'shairport'    = 'AirPlay'
    'iTunes'       = 'AirPlay 스피커 출력 가능'
    'AppleMusic'   = 'AirPlay 스피커 출력 가능'
    'Spotify'      = 'Spotify Connect(다른 기기로 재생 가능)'
    'mDNSResponder'= 'Bonjour(AirPlay 기기 검색)'
    'obs64'        = '방송/녹화(소리 캡처)'
    'Discord'      = '통화/화면공유(소리 공유 가능)'
    'Zoom'         = '통화/화면공유(소리 공유 가능)'
    'ms-teams'     = '통화/화면공유(소리 공유 가능)'
    'Teams'        = '통화/화면공유(소리 공유 가능)'
    'KakaoTalk'    = '통화(소리 공유 가능)'
    'voicemeeter'  = '가상 오디오 라우팅'
}
$procs = Get-Process
$foundApp = $false
foreach ($key in $streamApps.Keys) {
    $hit = @($procs | Where-Object { $_.ProcessName -like "*$key*" })
    if ($hit.Count -gt 0) {
        $foundApp = $true
        $names = ($hit | Select-Object -ExpandProperty ProcessName -Unique) -join ', '
        Write-Warn ("실행 중: {0}  ->  {1}" -f $names, $streamApps[$key])
    }
}
if (-not $foundApp) { Write-Ok '알려진 AirPlay/전송/통화 프로그램이 실행 중이지 않습니다.' }

foreach ($svcName in @('Bonjour Service', 'WMPNetworkSvc')) {
    $s = Get-Service -Name $svcName
    if ($s -and $s.Status -eq 'Running') {
        Write-Info ("서비스 실행 중: {0} ({1})" -f $s.DisplayName, $s.Name)
    }
}

# AirPlay(7000/7100/5000), Chromecast(8008/8009) 포트로 나가는 연결 / 대기 중인 포트
$castPorts = @(5000, 7000, 7100, 8008, 8009)
$tcp = @(Get-NetTCPConnection)
$out = @($tcp | Where-Object { $_.State -eq 'Established' -and $castPorts -contains $_.RemotePort })
$listen = @($tcp | Where-Object { $_.State -eq 'Listen' -and @(7000, 7100) -contains $_.LocalPort })
foreach ($c in $out) {
    $pn = (Get-Process -Id $c.OwningProcess).ProcessName
    Write-Warn ("{0} 이(가) {1}:{2} 로 연결 중 (AirPlay/Cast 포트)" -f $pn, $c.RemoteAddress, $c.RemotePort)
}
foreach ($c in $listen) {
    $pn = (Get-Process -Id $c.OwningProcess).ProcessName
    Write-Info ("{0} 이(가) 포트 {1} 에서 대기 중 (AirPlay 수신기일 수 있음)" -f $pn, $c.LocalPort)
}
if ($out.Count -eq 0) { Write-Ok 'AirPlay/Chromecast 포트로 나가는 연결이 없습니다.' }

# ---------------------------------------------------------------------------
# 6. 원격 데스크톱 세션
# ---------------------------------------------------------------------------
Write-Section '6. 원격 데스크톱 (원격 접속자에게 소리가 전달될 수 있음)'
$q = (quser 2>$null)
$rdp = @($q | Where-Object { $_ -match 'rdp-tcp' })
if ($rdp.Count -gt 0) {
    foreach ($l in $rdp) { Write-Warn ("원격 데스크톱 세션: {0}" -f $l.Trim()) }
} else {
    Write-Ok '원격 데스크톱 세션이 없습니다.'
}
$remoteTools = @($procs | Where-Object { $_.ProcessName -match '^(TeamViewer|AnyDesk|rustdesk|ScreenConnect|Chrome Remote Desktop|remoting_host|ParsecD?|Splashtop.*)$' })
foreach ($p in ($remoteTools | Select-Object -ExpandProperty ProcessName -Unique)) {
    Write-Warn ("원격 제어 프로그램 실행 중: {0} (원격 접속 시 소리 전달 가능)" -f $p)
}

# ---------------------------------------------------------------------------
# 요약
# ---------------------------------------------------------------------------
Write-Section '판정 요약'
if ($findings.Count -eq 0) {
    Write-Host '  근처 사람의 블루투스 이어폰(AirPods 포함)으로 이 PC의 소리가 나갈 수 있는 경로가 발견되지 않았습니다.' -ForegroundColor Green
    Write-Host '  - 블루투스 이어폰은 PC와 페어링되어 있어야만 소리를 받을 수 있고, 페어링은 PC 쪽 승인이 필요합니다.' -ForegroundColor Green
    if (-not $coreOk) { Write-Host '  - 단, 4번(프로그램별 출력 장치) 점검은 실패했습니다. 설정 > 시스템 > 소리 > 볼륨 믹서에서 직접 확인하세요.' -ForegroundColor Yellow }
    Write-Host '  - 이 점검은 실행한 순간 기준입니다. 의심되면 블루투스를 끄고(설정 > Bluetooth 및 장치) 다시 실행해 보세요.' -ForegroundColor Green
} else {
    Write-Host ("  확인이 필요한 항목 {0}개:" -f $findings.Count) -ForegroundColor Yellow
    $i = 1
    foreach ($f in $findings) { Write-Host ("   {0}. {1}" -f $i, $f) -ForegroundColor Yellow; $i++ }
    Write-Host ''
    Write-Host '  모르는 기기라면: 설정 > Bluetooth 및 장치 > 해당 기기 ... > 장치 제거' -ForegroundColor Yellow
    Write-Host '  모르는 프로그램이라면: 작업 관리자에서 종료 후, 설정 > 앱 에서 출처를 확인하세요.' -ForegroundColor Yellow
}

if ($ReportPath) { Stop-Transcript | Out-Null; Write-Host "`n보고서 저장: $ReportPath" }
