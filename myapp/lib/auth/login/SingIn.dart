import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:myapp/auth/creation/SingUp.dart';
import 'package:myapp/auth/login/oublier.dart';
import '../../bloc/api/Api.dart';
import '../../main.dart';
import '../../www/link.dart';

class Singin extends StatefulWidget {
  const Singin({super.key});

  @override
  State<Singin> createState() => _SinginState();
}

class _SinginState extends State<Singin> {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          (Circle == true)
              ? Center(
                child: CircularProgressIndicator(
                  strokeWidth: 4,
                  color: Colors.blue,
                ),
              )
              : SafeArea(
                child: Stack(
                  children: [
                    Positioned(
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        height: MediaQuery.of(context).size.height,
                        child: SvgPicture.asset(
                          "images/back1.svg",
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      top: 130,
                      left: 25,
                      right: null,
                      bottom: null,
                      child: Column(
                        children: [
                          Text(
                            "Bienvenue",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 30,
                              fontFamily: "Font2",
                            ),
                          ),
                          Text(
                            "à nouveau",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 25,
                              fontFamily: "Font2",
                            ),
                          ),
                        ],
                      ),
                    ),
                    Positioned.fill(
                      top: 270,
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
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Row(children: [
              
                              
                              ],
                            ),
                                    SizedBox(
                                      width: 320,
                                      height: 54,
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
                                          filled: true,
                                          fillColor: Colors.white,
                                          hintText: "Email",
                                          hintStyle: TextStyle(
                                            color: Color(0xFFCCCCCC),
                                          ),
                                          contentPadding: EdgeInsets.symmetric(
                                            vertical: 1,
                                            horizontal: 15,
                                          ),
                                          enabledBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
                                            ),
                                            borderSide: BorderSide(
                                              color: Colors.transparent,
                                            ),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
                                            ),
                                            borderSide: BorderSide(
                                              color: Color.fromARGB(
                                                255,
                                                255,
                                                255,
                                                255,
                                              ),
                                            ),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
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
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    const Row(children: [
                              
                              ],
                            ),
                                    SizedBox(
                                      width: 320,
                                      height: 51,
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
                                          filled: true,
                                          fillColor: Colors.white,
                                          hintText: "password",
                                          hintStyle: TextStyle(
                                            color: Color(0xFFCCCCCC),
                                            fontSize: 16,
                                          ),

                                          suffixIcon: IconButton(
                                            icon: Icon(
                                              icon_Voir
                                                  ? Icons.visibility_off
                                                  : Icons.visibility,
                                            ),
                                            onPressed: () {
                                              showPass();
                                            },
                                          ),
                                          contentPadding: EdgeInsets.symmetric(
                                            vertical: 20,
                                            horizontal: 15,
                                          ),
                                          enabledBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
                                            ),
                                            borderSide: BorderSide(
                                              color: Colors.transparent,
                                            ),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
                                            ),
                                            borderSide: BorderSide(
                                              color: Color.fromARGB(
                                                255,
                                                255,
                                                255,
                                                255,
                                              ),
                                            ),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(20),
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
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                // margin: EdgeInsets.symmetric(vertical: 2, horizontal: 2),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    MaterialButton(
                                      onPressed: () {
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => Oublier(),
                                          ),
                                        );
                                      },
                                      child: Text(
                                        "Mot de passe oublié ?",
                                        style: TextStyle(
                                          fontSize: 10,
                                          color: Color(0xFF475569),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              //      SizedBox(height: 40),
                              MaterialButton(
                                minWidth: 200,
                                padding: EdgeInsets.symmetric(
                                  vertical: 10,
                                  horizontal: 10,
                                ),
                                color: Color(0xFFA855F7),
                                onPressed: () {
                                  if (Mycontroller.currentState!.validate()) {
                                    Login();
                                  }
                                },
                                child: Text(
                                  "se connecter",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w400,
                                    fontFamily: "Font2",
                                  ),
                                ),
                              ),
                              SizedBox(height: 9),
                              Align(
                                child: Text(
                                  "ou",
                                  style: TextStyle(
                                    color: Color(0xFF475569),
                                    fontSize: 16,
                                  ),
                                ),
                              ),
                              SizedBox(height: 15),
                              Container(
                                width: MediaQuery.of(context).size.width,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SizedBox(width: 10),
                                    SvgPicture.asset("images/10.svg"),
                                  ],
                                ),
                              ),

                              Container(
                                width: MediaQuery.of(context).size.width,
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    SizedBox(width: 30),
                                    Text(
                                      "N'avez pas de compte?",
                                      style: TextStyle(
                                        color: Color(0xFF475569),
                                        fontSize: 13,
                                        fontFamily: "Font2",
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => Signup(),
                                          ),
                                        );
                                      },
                                      child: Text("inscription"),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
    );
  }
}
