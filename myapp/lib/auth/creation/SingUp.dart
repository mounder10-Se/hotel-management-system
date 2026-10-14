import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:myapp/auth/creation/confirmationCreation.dart';
import 'package:myapp/auth/login/SingIn.dart';
import 'package:myapp/www/link.dart';

import '../../bloc/api/Api.dart';

class Signup extends StatefulWidget {
  const Signup({super.key});

  @override
  State<Signup> createState() => _SignupState();
}

class _SignupState extends State<Signup> {
  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController telephone = TextEditingController();
  TextEditingController prenom = TextEditingController();

  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  bool showPassword = true;
  bool loading = false;
  Api api = Api();

  singup() async {
    var respons = await api.postRequest(lienSingUp, {
      "email": emailController.text.toString(),
    });
    if (respons["Etat"] == "Success") {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder:
              (context) => Confirmationcreation(
                email: emailController.text.toString(),
                nom: nameController.text.toString(),
                prenom: prenom.text.toString(),
                telephone: telephone.text.toString(),
                password: passwordController.text,
              ),
        ),
      );
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
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          loading
              ? const Center(child: CircularProgressIndicator())
              : SafeArea(
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: SvgPicture.asset(
                        "images/back1.svg",
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned.fill(
                      top: 150,
                      child: SizedBox(
                        height: MediaQuery.of(context).size.height,
                        child: SingleChildScrollView(
                          child: Padding(
                            padding: const EdgeInsets.all(20.0),
                            child: Form(
                              key: formKey,
                              child: Column(
                                children: [
                                  Align(
                                    alignment: Alignment.topLeft,
                                    child: const Text(
                                      "Créer un compte",
                                      style: TextStyle(
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                        fontFamily: "Font2",
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 23),

                                  Container(
                                    width: MediaQuery.of(context).size.width,
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceAround,
                                      children: [
                                        SizedBox(
                                          height: 51,
                                          width: 150,
                                          child: TextFormField(
                                            controller: nameController,
                                            validator:
                                                (val) =>
                                                    val!.isEmpty
                                                        ? "Nom requis"
                                                        : null,
                                            decoration: const InputDecoration(
                                              hintText: "Nom",
                                              filled: true,
                                              fillColor: Colors.white,
                                              hintStyle: TextStyle(
                                                color: Color(0xFFCCCCCC),
                                              ),
                                              contentPadding:
                                                  EdgeInsets.symmetric(
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
                                                  color: Color(0xFFA855F7),
                                                  width: 2,
                                                ),
                                              ),
                                              errorBorder: OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(20),
                                                ),
                                                borderSide: BorderSide(
                                                  color: Colors.redAccent,
                                                  width: 1,
                                                ),
                                              ),
                                              focusedErrorBorder:
                                                  OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(20),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Colors.redAccent,
                                                      width: 2,
                                                    ),
                                                  ),
                                              errorStyle: TextStyle(
                                                color: Colors.redAccent,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                        ),
                                        SizedBox(width: 20),
                                        SizedBox(
                                          height: 51,
                                          width: 150,
                                          child: TextFormField(
                                            controller: prenom,
                                            validator:
                                                (val) =>
                                                    val!.isEmpty
                                                        ? "Prenom requis"
                                                        : null,
                                            decoration: const InputDecoration(
                                              hintText: "Prenom",
                                              filled: true,
                                              fillColor: Colors.white,
                                              hintStyle: TextStyle(
                                                color: Color(0xFFCCCCCC),
                                              ),
                                              contentPadding:
                                                  EdgeInsets.symmetric(
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
                                                  color: Color(0xFFA855F7),
                                                  width: 2,
                                                ),
                                              ),
                                              errorBorder: OutlineInputBorder(
                                                borderRadius: BorderRadius.all(
                                                  Radius.circular(20),
                                                ),
                                                borderSide: BorderSide(
                                                  color: Colors.redAccent,
                                                  width: 1,
                                                ),
                                              ),
                                              focusedErrorBorder:
                                                  OutlineInputBorder(
                                                    borderRadius:
                                                        BorderRadius.all(
                                                          Radius.circular(20),
                                                        ),
                                                    borderSide: BorderSide(
                                                      color: Colors.redAccent,
                                                      width: 2,
                                                    ),
                                                  ),
                                              errorStyle: TextStyle(
                                                color: Colors.redAccent,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  SizedBox(
                                    width: 320,
                                    height: 51,
                                    child: TextFormField(
                                      controller: emailController,
                                      validator: (val) {
                                        if (val == null || val.isEmpty)
                                          return "Email requis";
                                        if (!RegExp(
                                          r'^[\w-\.]+@([\w-]+\.)+[\w]{2,4}$',
                                        ).hasMatch(val))
                                          return "Email invalide";
                                        return null;
                                      },
                                      decoration: const InputDecoration(
                                        hintText: "Email",
                                        filled: true,
                                        fillColor: Colors.white,
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
                                            color: Color(0xFFA855F7),
                                            width: 2,
                                          ),
                                        ),
                                        errorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 1,
                                          ),
                                        ),
                                        focusedErrorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 2,
                                          ),
                                        ),
                                        errorStyle: TextStyle(
                                          color: Colors.redAccent,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  SizedBox(
                                    width: 320,
                                    height: 51,
                                    child: TextFormField(
                                      controller: telephone,
                                      validator: (val) {
                                        if (val == null || val.isEmpty)
                                          return "numero de telephone requis";

                                        return null;
                                      },
                                      decoration: const InputDecoration(
                                        hintText: "Telephone",
                                        filled: true,
                                        fillColor: Colors.white,
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
                                            color: Color(0xFFA855F7),
                                            width: 2,
                                          ),
                                        ),
                                        errorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 1,
                                          ),
                                        ),
                                        focusedErrorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 2,
                                          ),
                                        ),
                                        errorStyle: TextStyle(
                                          color: Colors.redAccent,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  ),
                                  SizedBox(height: 10),
                                  SizedBox(
                                    height: 54,
                                    width: 320,
                                    child: TextFormField(
                                      controller: passwordController,
                                      obscureText: showPassword,
                                      validator:
                                          (val) =>
                                              val!.length < 6
                                                  ? "Mot de passe trop court"
                                                  : null,
                                      decoration: InputDecoration(
                                        hintText: "Mot de passe",
                                        filled: true,
                                        fillColor: Colors.white,
                                        hintStyle: TextStyle(
                                          color: Color(0xFFCCCCCC),
                                        ),
                                        contentPadding: EdgeInsets.symmetric(
                                          vertical: 1,
                                          horizontal: 15,
                                        ),
                                        suffixIcon: IconButton(
                                          icon: Icon(
                                            showPassword
                                                ? Icons.visibility_off
                                                : Icons.visibility,
                                            color: Color(0xFFA855F7),
                                          ),
                                          onPressed:
                                              () => setState(
                                                () =>
                                                    showPassword =
                                                        !showPassword,
                                              ),
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
                                            color: Color(0xFFA855F7),
                                            width: 2,
                                          ),
                                        ),
                                        errorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 1,
                                          ),
                                        ),
                                        focusedErrorBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.all(
                                            Radius.circular(20),
                                          ),
                                          borderSide: BorderSide(
                                            color: Colors.redAccent,
                                            width: 2,
                                          ),
                                        ),
                                        errorStyle: TextStyle(
                                          color: Colors.redAccent,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 20),

                                  Container(
                                    width: MediaQuery.of(context).size.width,
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        SizedBox(width: 30),
                                        Text(
                                          "Vous avez déjà un compte ?",
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
                                                builder: (context) => Singin(),
                                              ),
                                            );
                                          },
                                          child: Text("login"),
                                        ),
                                      ],
                                    ),
                                  ),

                                  SizedBox(height: 10),
                                  MaterialButton(
                                    minWidth: 200,
                                    padding: EdgeInsets.symmetric(
                                      vertical: 10,
                                      horizontal: 10,
                                    ),
                                    color: Color(0xFFA855F7),
                                    onPressed: () {
                                      if (formKey.currentState!.validate()) {
                                        singup();
                                      }
                                    },
                                    child: Text(
                                      "inscrire",
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
