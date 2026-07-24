import os

file_path = r"c:\Users\BOSS\.gemini\antigravity\scratch\biolink-free\src\app\dashboard\links\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Line 714 (index 713) and 715 (index 714) are to be removed
# We must be careful about exact index. L714 is index 713.
# Let's verify content of these lines first in the script to be safe
if "</motion.div>" in lines[713] and ")}" in lines[714]:
    # Remove them
    del lines[714] # Removing 715 first
    del lines[713] # Removing 714
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully removed residual tags.")
else:
    print(f"Error: Could not find expected content at line 714/715. Found: '{lines[713].strip()}' and '{lines[714].strip()}'")
