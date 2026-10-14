import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:myapp/auth/login/confirmationRecuperation.dart';
import 'package:myapp/bloc/api/Api.dart';

class Oublier extends StatefulWidget {
  const Oublier({super.key});

  @override
  State<Oublier> createState() => _OublierState();
}

class _OublierState extends State<Oublier> {
  GlobalKey<FormState> ke = GlobalKey();
  TextEditingController email = TextEditingController();
  Api crdu = Api();
  testingEmail() async {
    var resposn = await crdu.postRequest("http://192.168.70.25:3000/Mobile/code", {
      "email": email.text.toString(),
    });
    if (email.text.toString() == "") {
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
                  "Entrez une adress e-mail",
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
              "Vous devez entrer une adress e-mail pour continuer",
              style: TextStyle(fontSize: 13, color: Colors.black87),
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
    } else {
      if (resposn["Etat"] == "Success") {
        Navigator.of(context).push(
          MaterialPageRoute(builder: (context) => Confirmationrecuperation(id_user: resposn["id"].toString(),)),
        );
      } else {
        if (resposn["Etat"] == "email invalide") {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                title: const Column(
                  children: [
                    Icon(
                      Icons.error_outline,
                      color: Colors.redAccent,
                      size: 40,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Error",
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
                  "email invalide",
                  style: TextStyle(fontSize: 13, color: Colors.black87),
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
                        "Récupération de compte ",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          fontFamily: "Font4",
                        ),
                      ),
                      SizedBox(height: 7),
                      Text(
                        "Entrez votre adresse e-mail.",
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFF475569),
                        ),
                      ),
                      SizedBox(height: 20),
                      SizedBox(
                        height: 50,
                        child: TextField(
                          controller: email,
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            contentPadding: EdgeInsets.all(10),
                            labelText: "Adress e-mail",
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
                                testingEmail();
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
