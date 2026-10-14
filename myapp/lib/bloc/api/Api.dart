import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';

class Api {
  getrequest(String url) async {
    var respons = await http.get(Uri.parse(url));
    try {
      if (respons.statusCode == 200) {
        print("Connectionn avec Success");
        return jsonDecode(respons.body);
      }
    } catch (e) {
      print("Error est $e");
    }
  }

   postRequest(String url, Map data) async {
    try {
      var respons = await http.post(Uri.parse(url), headers: {
        "Content-Type": "application/json", 
      }, body: jsonEncode(data));
      // test du connection :
      if (respons.statusCode == 200) {
        print("Connection est possible");
        return jsonDecode(respons.body);
      } else {
        print("connection impossible");
      }
    } catch (e) {
      print("Error : $e");
    }
  }

    postFile(String url, Map data, File myFile) async {
    var length = await myFile.length();
    var Stream = http.ByteStream(myFile.openRead());
    var request = http.MultipartRequest("POST", Uri.parse(url));
    var multipartFile = http.MultipartFile("image", Stream, length,
        filename: basename(myFile.path));
    request.files.add(multipartFile);

    data.forEach((key, value) {
      request.fields[key] = value;
    });
    var myrequest = await request.send();
    var respons = await http.Response.fromStream(myrequest);

    if (respons.statusCode == 200) {
      print("connection success");
      return jsonDecode(respons.body);
    } else {
      print("connection faild");
    }
  }

}

