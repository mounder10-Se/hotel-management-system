import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import '../bloc/api/Api.dart';
import '../json/perssonModule.dart';
import '../main.dart';
import '../www/link.dart';

class Gestionprofile extends StatefulWidget {
  final persson P1;
  const Gestionprofile({super.key, required this.P1});

  @override
  State<Gestionprofile> createState() => _GestionprofileState();
}

class _GestionprofileState extends State<Gestionprofile> {
  TextEditingController name = TextEditingController();
  TextEditingController lastname = TextEditingController();
  TextEditingController email = TextEditingController();
  TextEditingController number = TextEditingController();
  GlobalKey<FormState> frm = GlobalKey();
  File? MyFile;
  Api crdu = Api();
  @override
  void initState() {
    super.initState();
    setState(() {
      name.text = widget.P1.name.toString();
      lastname.text = widget.P1.prenom.toString();
      email.text = widget.P1.email.toString();
      number.text = widget.P1.numero.toString();
    });
  }

  bool uploadSuccess = false;
  // update user :

  updateUser() async {
    if (MyFile == null) {
      var respons = await crdu.postRequest(lienModifierUser, {
        "user_id": Connect.get("user_id"),
        "nom": name.text.toString(),
        "prenom": lastname.text.toString(),
        "email": email.text.toString(),
        "numero": number.text.toString(),
      });

      if (respons["Etat"] == "Success") {
        Navigator.of(context).pop();
        return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Container(
                child: Image.asset("images/checked.png", width: 40, height: 40),
              ),
              content: Container(child: Text("votre compte est mise a jourée")),
              actions: [
                InkWell(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  child: Text("OK"),
                ),
              ],
            );
          },
        );
      } else {
        print("youpi");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            margin: EdgeInsets.only(bottom: 80, left: 16, right: 16),
            behavior: SnackBarBehavior.floating,
            content: Text("mise a jour faild"),
          ),
        );
      }
    } else {
      var respons = await crdu.postFile(lienModifierUser, {
        "user_id": Connect.get("user_id"),
        "nom": name.text.toString(),
        "prenom": lastname.text.toString(),
        "email": email.text.toString(),
        "numero": number.text.toString(),
      }, MyFile!);
      if (respons["Etat"] == "Success") {
        Navigator.of(context).pop();
        return showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              title: Container(
                child: Image.asset("images/checked.png", width: 27, height: 27),
              ),
              content: Container(child: Text("votre compte est mise a jourée")),
              actions: [
                InkWell(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  child: Text("OK"),
                ),
              ],
            );
          },
        );
      } else {
        print("youpi");
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            margin: EdgeInsets.only(bottom: 80, left: 16, right: 16),
            behavior: SnackBarBehavior.floating,
            content: Text("mise a jour faild"),
          ),
        );
      }
    }
  }

  //
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: SafeArea(
          bottom: false,
          top: false,
          child: Stack(
            children: [
              Positioned(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Color.fromARGB(255, 218, 185, 185),
                        Color.fromARGB(255, 207, 196, 222),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                ),
              ),
              Positioned(
                bottom: 0,
                width: MediaQuery.of(context).size.width,
                height: 380,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(45),
                      topRight: Radius.circular(45),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: Container(
                    margin: EdgeInsets.symmetric(horizontal: 20, vertical: 20),

                    child: Form(
                      child: ListView(
                        // crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Align(
                            child: Container(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Image.asset(
                                    "images/id-card (2).png",
                                    width: 25,
                                    height: 25,
                                  ),
                                  SizedBox(width: 5),
                                  Text(
                                    "Information Actuel",
                                    style: TextStyle(fontFamily: "Font1"),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Container(
                            height: 90,
                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.topLeft,
                                  child: Text("nom : "),
                                ),
                                SizedBox(
                                  width: 320,
                                  height: 55,
                                  child: TextFormField(
                                    validator: (value) {
                                      if (value!.isEmpty) {
                                        return "Saisir votre nom";
                                      }

                                      return null;
                                    },
                                    controller: name,
                                    decoration: const InputDecoration(
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 20,
                                        horizontal: 20,
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFFD781A4),
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
                                      focusedErrorBorder: OutlineInputBorder(
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

                                //
                              ],
                            ),
                          ),

                          //
                          Container(
                            height: 90,

                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.topLeft,
                                  child: Text("prenom :"),
                                ),
                                SizedBox(
                                  width: 320,
                                  height: 55,
                                  child: TextFormField(
                                    validator: (value) {
                                      if (value!.isEmpty) {
                                        return "Saisir votre prenom";
                                      }

                                      return null;
                                    },
                                    controller: lastname,
                                    decoration: const InputDecoration(
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 20,
                                        horizontal: 20,
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFFD781A4),
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
                                      focusedErrorBorder: OutlineInputBorder(
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

                                //
                              ],
                            ),
                          ),

                          Container(
                            height: 90,

                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.topLeft,
                                  child: Text("E-mail : "),
                                ),
                                SizedBox(
                                  width: 320,
                                  height: 55,
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
                                    controller: email,
                                    decoration: const InputDecoration(
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 20,
                                        horizontal: 20,
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFFD781A4),
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
                                      focusedErrorBorder: OutlineInputBorder(
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

                                //
                              ],
                            ),
                          ),

                          Container(
                            height: 90,
                            child: Column(
                              children: [
                                Align(
                                  alignment: Alignment.topLeft,
                                  child: Text("Numero : "),
                                ),
                                SizedBox(
                                  width: 320,
                                  height: 55,
                                  child: TextFormField(
                                    validator: (value) {
                                      if (value!.isEmpty) {
                                        return "Saisir votre numero";
                                      }

                                      return null;
                                    },
                                    controller: number,
                                    decoration: const InputDecoration(
                                      contentPadding: EdgeInsets.symmetric(
                                        vertical: 20,
                                        horizontal: 20,
                                      ),
                                      enabledBorder: OutlineInputBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(15),
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0xFFD781A4),
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
                                      focusedErrorBorder: OutlineInputBorder(
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

                                //
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 41,
                left: 5,
                bottom: null,
                right: null,
                width: MediaQuery.of(context).size.width,
                child: Container(
                  height: 270,
                  // color: Colors.cyan,
                  width: double.infinity,
                  child: Column(
                    children: [
                      Container(
                        width: double.infinity,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            InkWell(
                              onTap: () {
                                Navigator.of(context).pop();
                              },
                              child: Container(
                                margin: EdgeInsets.only(left: 10, right: 10),
                                child: Icon(
                                  Icons.arrow_back_rounded,
                                  color: const Color.fromARGB(
                                    255,
                                    255,
                                    255,
                                    255,
                                  ),
                                ),
                              ),
                            ),

                            Align(
                              alignment: AlignmentDirectional.topStart,
                              child: Text(
                                "Modifier mon profil",
                                style: TextStyle(
                                  color: Color.fromARGB(255, 255, 255, 255),
                                  fontSize: 25,
                                  fontFamily: 'Font1',
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),

                            InkWell(
                              onTap: () {
                                updateUser();
                              },
                              child: Container(
                                margin: EdgeInsets.only(left: 10, right: 20),
                                child: SvgPicture.asset(
                                  "images/save.svg",
                                  color: const Color.fromARGB(
                                    255,
                                    255,
                                    255,
                                    255,
                                  ),
                                  width: 25,
                                  height: 25,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 30),
                        child: Stack(
                          children: [
                            Positioned(
                              child:
                                  (widget.P1.image == null)
                                      ? Container(
                                        width: 120,
                                        height: 120,
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.2),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          Icons.person,
                                          color: Colors.white,
                                          size: 20,
                                        ),
                                      )
                                      : Container(
                                        width: 120,
                                        height: 120,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          boxShadow: [
                                            BoxShadow(
                                              color: const Color.fromARGB(
                                                207,
                                                84,
                                                80,
                                                80,
                                              ),
                                              blurRadius: 10,
                                            ),
                                          ],
                                        ),
                                        child: ClipOval(
                                          child: Image.network(
                                            "${linkImages}/${widget.P1.image}",
                                            width: 110,
                                            height: 110,
                                            fit: BoxFit.fill,
                                          ),
                                        ),
                                      ),
                            ),
                            Positioned(
                              bottom: 1,
                              right: 0,
                              child: Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color:
                                      (uploadSuccess == true)
                                          ? Color.fromARGB(255, 47, 154, 20)
                                          : Color(0xFF2D1300),
                                  shape: BoxShape.circle,
                                  boxShadow: [BoxShadow(blurRadius: 10)],
                                ),
                                child: InkWell(
                                  onTap: () {
                                    showModalBottomSheet(
                                      context: context,
                                      builder: (BuildContext context) {
                                        return Container(
                                          height: 150,
                                          // width: double.infinity,
                                          child: Container(
                                            margin: EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 10,
                                            ),
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.spaceAround,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                // Row(
                                                //   mainAxisAlignment: MainAxisAlignment.center,
                                                //   children: [
                                                //                                                                       Container(
                                                // child: Image.asset("images/down-arrow.png",width: 40, height: 40,),
                                                //                       ),
                                                //   ],
                                                // ),
                                                Row(
                                                  // mainAxisAlignment: MainAxisAlignment.spaceAround,
                                                  children: [
                                                    InkWell(
                                                      onTap: () {
                                                        Navigator.of(
                                                          context,
                                                        ).pop();
                                                      },
                                                      child: Image.asset(
                                                        "images/close.png",
                                                        width: 22,
                                                        height: 22,
                                                      ),
                                                    ),
                                                    SizedBox(width: 40),
                                                    Container(
                                                      margin: EdgeInsets.only(
                                                        left: 40,
                                                      ),
                                                      child: Text(
                                                        "Photo de profil",
                                                        style: TextStyle(
                                                          fontSize: 18,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                // les options:
                                                Container(
                                                  width: double.infinity,

                                                  child: Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Container(
                                                        child: Column(
                                                          children: [
                                                            InkWell(
                                                              onTap: () async {
                                                                XFile?
                                                                FE = await ImagePicker()
                                                                    .pickImage(
                                                                      source:
                                                                          ImageSource
                                                                              .camera,
                                                                    );

                                                                setState(() {
                                                                  MyFile = File(
                                                                    FE!.path,
                                                                  );
                                                                  uploadSuccess =
                                                                      true;
                                                                });
                                                              },
                                                              child: SvgPicture.asset(
                                                                "images/Button1.svg",
                                                                width: 70,
                                                                height: 70,
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                      SizedBox(width: 40),
                                                      Container(
                                                        child: Column(
                                                          children: [
                                                            InkWell(
                                                              onTap: () async {
                                                                XFile?
                                                                FE = await ImagePicker()
                                                                    .pickImage(
                                                                      source:
                                                                          ImageSource
                                                                              .gallery,
                                                                    );

                                                                setState(() {
                                                                  MyFile = File(
                                                                    FE!.path,
                                                                  );
                                                                  uploadSuccess =
                                                                      true;
                                                                });
                                                              },
                                                              child: SvgPicture.asset(
                                                                "images/Button2.svg",
                                                                width: 80,
                                                                height: 80,
                                                              ),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                ),

                                                //
                                              ],
                                            ),
                                          ),
                                        );
                                      },
                                    );
                                  },
                                  child: Icon(
                                    Icons.camera_alt_outlined,
                                    size: 25,
                                    color: Color.fromARGB(255, 255, 252, 252),
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
            ],
          ),
        ),
      ),
    );
  }
}
