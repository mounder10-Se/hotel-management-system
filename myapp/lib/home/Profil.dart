import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:myapp/options/singaler.dart';
import '../bloc/api/Api.dart';
import '../json/perssonModule.dart';
import '../main.dart';
import '../options/gestionProfile.dart';
import '../www/link.dart';

class Profil extends StatefulWidget {
  const Profil({super.key});

  @override
  State<Profil> createState() => _ProfilState();
}

class _ProfilState extends State<Profil> {
  Api crdu = Api();
  persson? user; //pour stocker les information d'une utilisateur..
  getUser() async {
    var respons = await crdu.getrequest(
      "${leinUser}/${Connect.get("user_id")}",
    );
    setState(() {
      user = persson.fromJson(respons[0]["Data"]);
    });
    return respons;
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,

        child: Stack(
          children: [
            Positioned(
              child: Container(
                width: double.infinity,
                height: 250,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color.fromARGB(255, 218, 185, 185),
                      Color.fromARGB(255, 207, 196, 222),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(30),
                    bottomRight: Radius.circular(30),
                  ),
                ),
              ),
            ),

            Positioned(
              top: 10,
              child: Container(
                width: MediaQuery.of(context).size.width,
                child: Row(
                  children: [
                    Container(
                      margin: EdgeInsets.only(left: 10),
                      child: PopupMenuButton(
                        position: PopupMenuPosition.under,
                        icon: Icon(Icons.menu, color: Colors.white, size: 28),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        tooltip: "Options",
                        itemBuilder:
                            (context) => [
                              PopupMenuItem(
                                child: Row(
                                  children: [
                                    Icon(Icons.edit, size: 20),
                                    SizedBox(width: 8),
                                    Text(
                                      "Modifier information",
                                      style: TextStyle(
                                        fontFamily: "Font3",
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  Future.delayed(
                                    Duration.zero,
                                    () => Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder:
                                            (context) =>
                                                Gestionprofile(P1: user!),
                                      ),
                                    ),
                                  );
                                },
                              ),
                              PopupMenuItem(
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.delete_forever,
                                      size: 20,
                                      color: Colors.red,
                                    ),
                                    SizedBox(width: 8),
                                    Text(
                                      "Supprimer le compte",
                                      style: TextStyle(
                                        fontFamily: "Font3",
                                        fontSize: 14,
                                        color: Colors.red,
                                      ),
                                    ),
                                  ],
                                ),
                                onTap: () {
                                  Future.delayed(
                                    Duration.zero,
                                    () => showDialog(
                                      context: context,
                                      builder: (context) {
                                        return AlertDialog(
                                          title: Row(
                                            children: [
                                              Image.asset(
                                                "images/crisis.png",
                                                width: 24,
                                                height: 24,
                                              ),
                                              SizedBox(width: 8),
                                              Text(
                                                "Supprimer le compte",
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontFamily: "Font3",
                                                ),
                                              ),
                                            ],
                                          ),
                                          content: Text(
                                            "La suppression de votre compte entraînera la perte définitive de toutes vos données personnelles. Cette action est irréversible. Souhaitez-vous confirmer la suppression de votre compte ?",
                                            style: TextStyle(
                                              fontSize: 14,
                                              fontFamily: "Font3",
                                            ),
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed: () {
                                                Navigator.of(context).pop();
                                              },
                                              child: Text(
                                                "Annuler",
                                                style: TextStyle(
                                                  fontFamily: "Font3",
                                                  color: Colors.grey[600],
                                                ),
                                              ),
                                            ),
                                            TextButton(
                                              onPressed: () {
                                                // TODO: Implement account deletion
                                                Navigator.of(context).pop();
                                              },
                                              child: Text(
                                                "Confirmer",
                                                style: TextStyle(
                                                  fontFamily: "Font3",
                                                  color: Colors.red,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        );
                                      },
                                    ),
                                  );
                                },
                              ),
                            ],
                      ),
                    ),
                    Expanded(
                      child: Center(
                        child: Text(
                          "Profile",
                          style: TextStyle(
                            fontFamily: 'Font3',
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 48,
                    ), // To balance the menu button on the left
                  ],
                ),
              ),
            ),

            FutureBuilder(
              future: getUser(),
              builder: (BuildContext context, AsyncSnapshot snap) {
                if (snap.hasData && snap.data != null) {
                  return Positioned(
                    bottom: 80,
                    left: 28,
                    child: Container(
                      width: 310,
                      height: 457,
                      //     padding: EdgeInsets.symmetric(vertical: 20 , horizontal: ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(5)),
                        color: const Color.fromARGB(255, 255, 255, 255),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 15,
                            offset: Offset(0, 5),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          SizedBox(height: 5),
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  // color: Colors.black.withOpacity(0.1),
                                  blurRadius: 3,
                                ),
                              ],
                            ),
                            child: CircleAvatar(
                              radius: 41,
                              backgroundColor: const Color.fromARGB(
                                255,
                                255,
                                255,
                                255,
                              ),
                              child: ClipOval(
                                child:
                                    (snap.data[0]["Data"]["image"] == null)
                                        ? Container(
                                          width: 90,
                                          height: 90,
                                          decoration: BoxDecoration(
                                            color: Colors.white.withOpacity(
                                              0.2,
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                          child: Icon(
                                            Icons.person,
                                            color: const Color.fromARGB(
                                              255,
                                              120,
                                              139,
                                              247,
                                            ),
                                            size: 40,
                                          ),
                                        )
                                        : Image.network(
                                          "${linkImages}/${snap.data[0]["Data"]["image"]}",
                                          width: 75,
                                          height: 75,
                                          fit: BoxFit.fill,
                                        ),
                              ),
                            ),
                          ),
                          SizedBox(height: 10),
                          Container(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Image.asset(
                                  "images/id-card (2).png",
                                  width: 25,
                                  height: 25,
                                ),
                                SizedBox(width: 7),
                                Text("À propos de toi"),
                              ],
                            ),
                          ),
                          Divider(),
                          SizedBox(height: 20),
                          Container(
                            width: double.infinity,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                SizedBox(width: 20),
                                SvgPicture.asset(
                                  "images/Container.svg",
                                  width: 37,
                                  height: 37,
                                ),
                                SizedBox(width: 13),
                                Container(
                                  width: 150,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "Nom",
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF6B7280),
                                          ),
                                        ),
                                      ),
                                      SizedBox(height: 5),
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "${snap.data[0]["Data"]["name"]} ${snap.data[0]["Data"]["prenom"]}",
                                          style: TextStyle(fontSize: 13),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          SizedBox(height: 20),
                          Container(
                            width: double.infinity,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                SizedBox(width: 20),
                                SvgPicture.asset(
                                  "images/Container3.svg",
                                  width: 37,
                                  height: 37,
                                ),
                                SizedBox(width: 13),
                                Container(
                                  width: 150,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "Téléphone",
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF6B7280),
                                          ),
                                        ),
                                      ),
                                      SizedBox(height: 5),
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "+213${snap.data[0]["Data"]["numero"]}",
                                          style: TextStyle(fontSize: 13),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          SizedBox(height: 20),
                          Container(
                            width: double.infinity,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                SizedBox(width: 20),
                                SvgPicture.asset(
                                  "images/Container2.svg",
                                  width: 37,
                                  height: 37,
                                ),
                                SizedBox(width: 13),
                                Container(
                                  width: 170,
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "Email",
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF6B7280),
                                          ),
                                        ),
                                      ),
                                      SizedBox(height: 5),
                                      Align(
                                        alignment: Alignment.topLeft,
                                        child: Text(
                                          "${snap.data[0]["Data"]["email"]}",
                                          style: TextStyle(fontSize: 13),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          Container(
                            margin: EdgeInsets.symmetric(
                              vertical: 15,
                              horizontal: 30,
                            ),
                            child: Align(
                              alignment: Alignment.topLeft,
                              child: Text(
                                "Actions",
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),

                          Expanded(
                            child: Column(
                              children: [
                                InkWell(
                                  onTap: () {
                                    Navigator.of(context).push(
                                      MaterialPageRoute(
                                        builder: (route) => Singaler(),
                                      ),
                                    );
                                  },
                                  child: Container(
                                    margin: EdgeInsets.symmetric(
                                      vertical: 5,
                                      horizontal: 5,
                                    ),
                                    width: double.infinity,
                                    child: Row(
                                      children: [
                                        SizedBox(width: 40),
                                        SvgPicture.asset(
                                          "images/Container5.svg",
                                          width: 35,
                                          height: 28,
                                        ),
                                        SizedBox(width: 10),
                                        Text("Signaler un problème"),
                                      ],
                                    ),
                                  ),
                                ),
                                SizedBox(height: 7),
                                InkWell(
                                  onTap: () {},

                                  child: Container(
                                    margin: EdgeInsets.symmetric(
                                      vertical: 5,
                                      horizontal: 5,
                                    ),
                                    width: double.infinity,
                                    child: Row(
                                      children: [
                                        SizedBox(width: 40),
                                        SvgPicture.asset(
                                          "images/Container10.svg",
                                          width: 35,
                                          height: 29,
                                        ),
                                        SizedBox(width: 10),
                                        Text("Aide et information"),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }
                if (snap.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(
                      strokeWidth: 1,
                      padding: EdgeInsets.all(10),
                    ),
                  );
                }
                return Center(
                  child: CircularProgressIndicator(
                    strokeWidth: 1,
                    padding: EdgeInsets.all(10),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
