import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:myapp/bloc/api/Api.dart';
import 'package:myapp/main.dart';

class Changerpassword extends StatefulWidget {
  final String id_user;
  const Changerpassword({super.key, required this.id_user});

  @override
  State<Changerpassword> createState() => _ChangerpasswordState();
}

class _ChangerpasswordState extends State<Changerpassword> {
  TextEditingController password1 = TextEditingController();
  TextEditingController password2 = TextEditingController();
  GlobalKey<FormState> ke = GlobalKey();
  Api crdu = Api();
  testingpass() async {
    var respons = await crdu.postRequest(
      "http://192.168.70.25:3000/Mobile/mdf",
      {"id_user": widget.id_user,"password" : password1.text.toString()},
    );
    if (password1.text != "") {
      if (respons["Etat"] == "Success") {
        Connect.setString("user_id", widget.id_user);
        Navigator.of(context).pushReplacementNamed("/principale");
      }
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            title: const Column(
              children: [
                Icon(Icons.error_outline, color: Colors.redAccent, size: 50),
                const SizedBox(height: 10),
                Text(
                  "Entrez une mot de pass",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.redAccent,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            content: Text(
              "Vous devez entrer une adress passowrd pour continuer",
              style: TextStyle(fontSize: 16, color: Colors.black87),
              textAlign: TextAlign.center,
            ),
            actionsAlignment: MainAxisAlignment.center,
            actions: [
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.redAccent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 30,
                    vertical: 12,
                  ),
                ),
                child: const Text(
                  "Réessayer",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SafeArea(
          child: Container(
            width: MediaQuery.of(context).size.width,
            height: MediaQuery.of(context).size.height,
            child: Stack(
              children: [
                Positioned(
                  child: SvgPicture.asset(
                    "images/back1.svg",
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  child: IconButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    icon: SvgPicture.asset(
                      "images/Vector1.svg",
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  top: 44,
                  left: 25,
                  right: 25,
                  bottom: 0,
                  child: Form(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Changement de mot de pass ",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            fontFamily: "Font4",
                          ),
                        ),
                        SizedBox(height: 7),
                        Text(
                          "Entrez votre nouveau mot de pass.",
                          style: TextStyle(
                            fontSize: 11,
                            color: Color(0xFF475569),
                          ),
                        ),
                        SizedBox(height: 20),
                        SizedBox(
                          height: 50,
                          child: TextField(
                            controller: password1,
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white,
                              contentPadding: EdgeInsets.all(10),
                              labelText: "mot de pass",
                              labelStyle: TextStyle(
                                fontSize: 12,
                                fontFamily: "Font4",
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(12),
                                ),
                                borderSide: BorderSide(),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(12),
                                ),
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                ),
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 18),
                        Container(
                          width: double.infinity,

                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              MaterialButton(
                                minWidth: 200,
                                padding: EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 10,
                                ),
                                color: Color(0xFFA855F7),
                                onPressed: () {
                                  testingpass();
                                },
                                child: Text(
                                  "Confirmer",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w400,
                                    fontFamily: "Font2",
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
