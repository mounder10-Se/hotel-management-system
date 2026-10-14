import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:myapp/bloc/api/Api.dart';
import 'package:myapp/main.dart';
import 'package:myapp/www/link.dart';

class Singaler extends StatefulWidget {
  const Singaler({super.key});

  @override
  State<Singaler> createState() => _SingalerState();
}

class _SingalerState extends State<Singaler> {
  String val = "Sélectionnez un type";
  List problems = [
    "Sélectionnez un type",
    "Bug technique",
    "Probléme de compte",
    "Probléme de paiment",
    "Autre",
  ];
  TextEditingController objectif = TextEditingController();
  TextEditingController message = TextEditingController();
  GlobalKey<FormState> key = GlobalKey();
  Api crdu = Api();
  ajouter() async {
    var respons = await crdu.postRequest(
      '$lienProblem/${Connect.getString("user_id")}',
      {
        "message": message.text.toString(),
        "obj": objectif.text.toString(),
        "type": val,
      },
    );
    if (respons["Etat"] == "Success") {
      Navigator.of(context).pop();
      return showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: Container(
              child: Image.asset("images/checked.png", width: 40, height: 40),
            ),
            content: Container(
              child: Text("Votre problème a été envoyé avec succès !"),
            ),
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
      print(respons["Etat"]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(kToolbarHeight),
        child: AppBar(
          flexibleSpace: Container(
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
          ),
          backgroundColor: Colors.transparent, 
          elevation: 0, 
          leading: IconButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            icon: Icon(Icons.arrow_back, color: Colors.white),
          ),
          title: Text(
            "Signaler un problème",
            style: TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 21,
              color: Colors.white,
            ),
          ),
          centerTitle: true,
        ),
      ),

      body: SafeArea(
        child: Container(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: SingleChildScrollView(
            child: Form(
              key: key,
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    margin: EdgeInsets.symmetric(vertical: 40, horizontal: 35),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Type de probléme",
                          style: TextStyle(color: Color(0xFF374151)),
                        ),
                        SizedBox(height: 10),
                        SizedBox(
                          height: 70,
                          child: DropdownButtonFormField(
                            focusColor: Color(0xFFD781A4),
                            validator: (value) {
                              if (value! == problems[0]) {
                                return "choisit une type";
                              }
                              return null;
                            },
                            isExpanded: true,

                            icon: SvgPicture.asset(
                              "images/Container11.svg",
                              width: 9,
                              height: 9,
                            ),
                            decoration: InputDecoration(
                              errorBorder: OutlineInputBorder(gapPadding: 200),
                              focusedErrorBorder: OutlineInputBorder(
                                gapPadding: 200,
                              ),
                              contentPadding: EdgeInsets.symmetric(
                                vertical: 10,
                                horizontal: 10,
                              ),
                              border: OutlineInputBorder(gapPadding: 100),
                            ),
                            value: problems[0],
                            items:
                                problems.map((e) {
                                  return DropdownMenuItem(
                                    value: e,
                                    child: Text("${e}"),
                                  );
                                }).toList(),
                            onChanged: (value) {
                              setState(() {
                                val = value.toString();
                              });
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  Container(
                    width: double.infinity,
                    margin: EdgeInsets.symmetric(horizontal: 35),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Objectif",
                          style: TextStyle(color: Color(0xFF374151)),
                        ),
                        SizedBox(height: 10),
                        SizedBox(
                          height: 50,
                          child: TextFormField(
                            controller: objectif,
                            decoration: InputDecoration(
                              hintText: "Quel est votre objectif ?",
                              hintStyle: TextStyle(fontSize: 12),
                              contentPadding: EdgeInsets.symmetric(
                                vertical: 10,
                                horizontal: 10,
                              ),
                              border: OutlineInputBorder(
                                gapPadding: 10,
                                borderSide: BorderSide(
                                  color: Color(0xFFD781A4),
                                ),
                                borderRadius: BorderRadius.all(
                                  Radius.circular(10),
                                ),
                              ),
                              focusedBorder: OutlineInputBorder(
                                gapPadding: 10,
                                borderSide: BorderSide(
                                  color: Color(0xFFD781A4),
                                ),
                                borderRadius: BorderRadius.all(
                                  Radius.circular(10),
                                ),
                              ),
                            ),
                            validator: (String? value) {
                              if (value!.isEmpty) {
                                return "s'il vous palit donne un Objectif";
                              }
                              return null;
                            },
                          ),
                        ),
                      ],
                    ),
                  ),

                  Container(
                    width: double.infinity,
                    margin: EdgeInsets.symmetric(vertical: 20, horizontal: 35),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Message",
                          style: TextStyle(color: Color(0xFF374151)),
                        ),
                        SizedBox(height: 10),
                        TextFormField(
                          scrollPadding: EdgeInsets.symmetric(
                            vertical: 20,
                            horizontal: 20,
                          ),
                          controller: message,
                          minLines: 3,
                          maxLines: null,
                          keyboardType: TextInputType.multiline,
                          decoration: InputDecoration(
                            hintText: "Décrivez votre problème en détail",
                            hintStyle: TextStyle(fontSize: 12),
                            border: OutlineInputBorder(
                              gapPadding: 10,
                              borderSide: BorderSide(
                                color: Color(0xFFD781A4),
                              ),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10),
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              gapPadding: 10,
                              borderSide: BorderSide(
                                color: Color(0xFFD781A4),
                              ),
                              borderRadius: BorderRadius.all(
                                Radius.circular(10),
                              ),
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return "s'il vous palit donne un message";
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 10),
                  MaterialButton(
                    
                    height: 50,
                    minWidth: 50,
                     
                    padding: EdgeInsets.symmetric(
                      vertical: 13,
                      horizontal: 100,
                    ),

                    color: Color(0xFFD781A4),
                    onPressed: () {
                      if (key.currentState!.validate()) {
                        ajouter();
                      } else {
                        print("error");
                      }
                    },
                    child: Text(
                      "Envoyer",
                      style: TextStyle(
                        color: const Color.fromARGB(255, 255, 255, 255),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
