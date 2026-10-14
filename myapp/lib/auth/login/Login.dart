import 'package:flutter/material.dart';
import '../../bloc/api/Api.dart';
import '../../main.dart';
import '../../www/link.dart';


// import 'package:pms/www/link.dart';
// import 'package:pms/main.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController username = TextEditingController();
  TextEditingController password = TextEditingController();
  GlobalKey<FormState> Mycontroller = GlobalKey();
  bool Voir_Passwodr = true;
  bool icon_Voir = false;
  bool Circle = false;
  Api crdu = Api();

  showPass() {
    if (icon_Voir == false) {
      setState(() {
        Voir_Passwodr = false;
        icon_Voir = true;
      });
    } else {
      setState(() {
        Voir_Passwodr = true;
        icon_Voir = false;
      });
    }
  }

  // methode pour 'Login'
  void Login() async {
    setState(() {
      Circle = true;
    });
    Future<dynamic>.delayed(const Duration(seconds: 10));
    var respons = await crdu.postRequest(lienLogin, {
      "email": username.text.toString(),
      "password": password.text.toString(),
    });
    if (respons["Etat"] == "Success") {
      Future.delayed(const Duration(seconds: 4), () {
        setState(() {
          Circle = false;
        });
        Connect.setString("user_id", respons["Data"].toString());
        Navigator.of(
          context,
        ).pushNamedAndRemoveUntil("/principale", (route) => false);
      });
      
    } else {
      Future.delayed(const Duration(seconds: 10), () {
        setState(() {
          Circle = false;
        });
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
                    "Error",
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
                "${respons["Etat"]}",
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
                    "Close",
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
      });
    }
  }

  //
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body:
          (Circle == true)
              ? Center(
                child: CircularProgressIndicator(
                  strokeWidth: 4,
                  color: Colors.blue,
                ),
              )
              : SafeArea(
                bottom: false,
                child: SingleChildScrollView(
                  child: Container(
                    width: double.infinity,
                    height: MediaQuery.of(context).size.height,
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: Image.asset(
                            "images/Figma.png",
                            fit: BoxFit.fill,
                          ),
                        ),
                        Positioned(
                          top: 260,
                          left: 20,
                          child: Text(
                            "Connectez-vous",
                            style: TextStyle(
                              fontSize: 30,
                              color: const Color(0xFFB29079),
                              fontFamily: "Nunito",
                            ),
                          ),
                        ),
                        Positioned(
                          top: 320,
                          left: 0,
                          right: 0,
                          child: Container(
                            height: 180,
                            child: Form(
                              key: Mycontroller,
                              child: Column(
                                children: [
                                  Container(
                                    width: 350,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Row(
                                          children: [
                                            SizedBox(width: 21),
                                            Align(
                                              alignment:
                                                  AlignmentDirectional
                                                      .bottomStart,
                                              child: Text(
                                                "Email",
                                                style: TextStyle(
                                                  color: const Color(
                                                    0xFFB29079,
                                                  ),
                                                  fontSize: 13,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        SizedBox(
                                          width: 320,
                                          height: 60,
                                          child: TextFormField(
                                            validator: (value) {
                                              if (value!.isEmpty) {
                                                return "Saisir votre email";
                                              }
                                              if (!RegExp(
                                                r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                                              ).hasMatch(value)) {
                                                return "Email invalide";
                                              }
                                              return null;
                                            },
                                            controller: username,
                                            decoration: const InputDecoration(
                                              contentPadding:
                                                  EdgeInsets.symmetric(
                                                    vertical: 20,
                                                    horizontal: 20,
                                                  ),
                                              enabledBorder: OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(15),
                                                ),
                                                borderSide: BorderSide(
                                                  color: const Color(
                                                    0xFFB29079,
                                                  ),
                                                ),
                                              ),
                                              focusedBorder: OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(15),
                                                ),
                                                borderSide: BorderSide(
                                                  color: Color(0xFF2F80ED),
                                                ),
                                              ),
                                              errorBorder: OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(15),
                                                ),
                                                borderSide: BorderSide(
                                                  color: Color.fromARGB(
                                                    255,
                                                    170,
                                                    47,
                                                    47,
                                                  ),
                                                ),
                                              ),
                                              focusedErrorBorder:
                                                  OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(15),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Color.fromARGB(
                                                        255,
                                                        170,
                                                        47,
                                                        47,
                                                      ),
                                                    ),
                                                  ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  Container(
                                    width: 350,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Row(
                                          children: [
                                            SizedBox(width: 21),
                                            Align(
                                              alignment:
                                                  AlignmentDirectional
                                                      .bottomStart,
                                              child: Text(
                                                "mot de pass",
                                                style: TextStyle(
                                                  color: const Color(
                                                    0xFFB29079,
                                                  ),
                                                  fontSize: 13,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        SizedBox(
                                          width: 320,
                                          height: 60,
                                          child: TextFormField(
                                            validator: (value) {
                                              if (value!.isEmpty) {
                                                return "saisir mote de pass";
                                              }
                                              return null;
                                            },
                                            autocorrect: true,
                                            obscureText: Voir_Passwodr,
                                            controller: password,
                                            decoration: InputDecoration(
                                              contentPadding:
                                                  EdgeInsets.symmetric(
                                                    vertical: 20,
                                                    horizontal: 20,
                                                  ),
                                              suffix:
                                                  (icon_Voir == true)
                                                      ? IconButton(
                                                        onPressed: () {
                                                          showPass();
                                                        },
                                                        icon: const Icon(
                                                          Icons.lock_open,
                                                        ),
                                                      )
                                                      : IconButton(
                                                        onPressed: () {
                                                          showPass();
                                                        },
                                                        icon: const Icon(
                                                          Icons.lock_outline,
                                                        ),
                                                      ),
                                              enabledBorder:
                                                  const OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(15),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: const Color(
                                                        0xFFB29079,
                                                      ),
                                                    ),
                                                  ),
                                              focusedBorder:
                                                  const OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(15),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Color(0xFF2F80ED),
                                                    ),
                                                  ),
                                              errorBorder:
                                                  const OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(15),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Color.fromARGB(
                                                        255,
                                                        170,
                                                        47,
                                                        47,
                                                      ),
                                                    ),
                                                  ),
                                              border: const OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(15),
                                                ),
                                                borderSide: BorderSide(
                                                  color: const Color(
                                                    0xFFB29079,
                                                  ),
                                                ),
                                              ),
                                              focusedErrorBorder:
                                                  const OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(15),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Color.fromARGB(
                                                        255,
                                                        170,
                                                        47,
                                                        47,
                                                      ),
                                                    ),
                                                  ),
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
                        ),
                        Positioned(
                          bottom: 40,
                          right: 12,
                          child: Container(
                            width: 127,
                            height: 52,
                            decoration: BoxDecoration(
                              border: Border.all(
                                width: 1,
                                color: Color.fromARGB(255, 255, 255, 255),
                              ),
                              borderRadius: BorderRadius.all(
                                Radius.circular(7),
                              ),
                            ),
                            child: Align(
                              child: MaterialButton(
                                onPressed: () {
                                  if (Mycontroller.currentState!.validate()) {
                                    Login();
                                  }
                                },
                                child: Align(
                                  child: Text(
                                    "Se connecter",
                                    style: TextStyle(
                                      color: const Color.fromARGB(
                                        255,
                                        255,
                                        255,
                                        255,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                        Positioned(
                          bottom: 10,
                          child: MaterialButton(
                            onPressed: () {},
                            child: Text(
                              "Nouveau ici ? Registre",
                              style: TextStyle(
                                color: const Color.fromARGB(255, 255, 255, 255),
                                fontSize: 13,
                                fontFamily: "Nunito",
                              ),
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
