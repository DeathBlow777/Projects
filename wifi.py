import subprocess
import re

def get_wifi_profiles():
    result = subprocess.run(['netsh', 'wlan', 'show', 'profiles'], capture_output=True, text=True)
    profiles = re.findall(r"All User Profile\s*:\s(.*)", result.stdout)
    return [p.strip() for p in profiles]

def get_password(profile_name):
    result = subprocess.run(['netsh', 'wlan', 'show', 'profile', profile_name, 'key=clear'], capture_output=True, text=True)
    match = re.search(r"Key Content\s*:\s(.*)", result.stdout)
    return match.group(1).strip() if match else None

def main():
    profiles = get_wifi_profiles()
    if not profiles:
        print("No Wi-Fi profiles found.")
        return

    for profile in profiles:
        password = get_password(profile)
        print(f"📶 SSID: {profile}")
        print(f"🔑 Password: {password if password else 'N/A'}\n")

if __name__ == "__main__":
    main()



