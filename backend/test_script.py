import urllib.request
import json

data = json.dumps({"selectedState": "MadhyaPradesh"}).encode("utf-8")
req = urllib.request.Request("http://127.0.0.1:8000/filter_land/", data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    res = json.loads(response.read().decode("utf-8"))
    print(json.dumps(res[0], indent=2) if len(res) > 0 else "Empty array")
except Exception as e:
    print(e)
