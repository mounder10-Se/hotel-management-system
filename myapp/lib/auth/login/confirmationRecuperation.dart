import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:myapp/auth/login/changerpassword.dart';
import 'package:myapp/bloc/api/Api.dart';


class Confirmationrecuperation extends StatefulWidget {
  final String id_user;
  const Confirmationrecuperation({super.key , required this.id_user});

  @override
  State<Confirmationrecuperation> createState() =>
      _ConfirmationrecuperationState();
}

class _ConfirmationrecuperationState extends State<Confirmationrecuperation> {
  TextEditingController code = TextEditingController();
  GlobalKey<FormState> ke = GlobalKey();
  Api crdu = Api();
  testingCode() async {
    var respons = await crdu.postRequest(
      "http://192.168.70.25:3000/Mobile/verifier",
      {"id_user": widget.id_user, "code": code.text.toString()},
    );
    if (respons["Etat"] == "Success") {
      Navigator.of(
        context,
      ).push(MaterialPageRoute(builder: (context) => Changerpassword(id_user: respons["id"].toString(),)));
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
                Icon(Icons.error_outline, color: Colors.redAccent, size: 40),
                const SizedBox(height: 10),
                Text(
                  "Ce code n'a pas fonctionné",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.redAccent,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
            content: Text(
              "Veuillez entrer de nouveau votre code ou en demander un autre",
              style: TextStyle(fontSize: 12, color: Colors.black87),
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
        child: Container(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Stack(
            children: [
              Positioned(
                child: SvgPicture.asset("images/back1.svg", fit: BoxFit.cover),
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
                  key: ke,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Confirmez votre compte",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          fontFamily: "Font4",
                        ),
                      ),
                      SizedBox(height: 7),
                      Text(
                        "Nous vous avons envoyé un code par e-mail. Entrez ce code pour confirmer votre compte.",
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFF475569),
                        ),
                      ),

                      SizedBox(height: 14),

                      SizedBox(
                        height: 50,
                        child: TextField(
                          controller: code,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: EdgeInsets.all(10),
                            labelText: "Entrez le code",
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
                              borderSide: BorderSide(color: Colors.transparent),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
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
                                testingCode();
                              },
                              child: Text(
                                "Continuer",
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
                      Container(
                        width: MediaQuery.of(context).size.width,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            TextButton(
                              onPressed: () {},
                              child: Text(
                                "Renvoyer le code",
                                style: TextStyle(fontSize: 11),
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
    );
  }
}
