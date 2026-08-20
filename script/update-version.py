#! /usr/bin/python3

import sys
import datetime
import json

PACKAGE_JSON_PATH = "./package.json"
VERSION_COMPONENT_PATH = "./src/component/snow-version.js"

version = None
with open(PACKAGE_JSON_PATH, "r") as read_handle:
    for line in read_handle.readlines():
        if "version" in line and not version:
            version = (
                line.split(":")[1].replace('"', "").replace(",", "").replace(" ", "")
            )

if len(sys.argv) < 2:
    print(f"Pass a new version. Current version is {version.replace('"', '')}")
    sys.exit(1)

if sys.argv[1] == "read":
    print(version.replace('"', ""), end="")
    sys.exit(0)

build_date = datetime.datetime.now().strftime("%B %d, %Y")
build_version = sys.argv[1]


def update_info(
    input_path: str,
    version_needle: str = None,
    version_replacement: str = None,
    build_needle: str = None,
    build_replacement: str = None,
):
    print(f"Updating {input_path}")
    file_content = ""
    version_found = False
    with open(input_path, "r") as read_handle:
        for line in read_handle.readlines():
            if not version_found:
                if version_needle and version_needle in line:
                    file_content += version_replacement
                    version_found = True
                elif build_needle and build_needle in line:
                    file_content += build_replacement
            else:
                file_content += line
    with open(input_path, "w") as write_handle:
        write_handle.write(file_content)


slip = "{"

update_info(
    input_path=PACKAGE_JSON_PATH,
    version_needle='  "version": "',
    version_replacement=f'{slip}\n  "name": "expo-snowui",\n  "version": "{build_version}",\n',
)

update_info(
    input_path=VERSION_COMPONENT_PATH,
    version_needle="const SNOWUI_VERSION",
    version_replacement=f'const SNOWUI_VERSION = "{build_version}"\n',
)
