import urllib.request
import json

data = json.dumps({
    "selectedState": "MadhyaPradesh",
    "selectedDistrict": "Shivpuri",
    "selectedVillage": "Khaniyadhana"
}).encode("utf-8")
req = urllib.request.Request("http://127.0.0.1:8000/filter_land/", data=data, headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    print(len(json.loads(response.read().decode("utf-8"))))
except Exception as e:
    print(e)
