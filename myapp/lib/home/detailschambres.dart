import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:myapp/payment.dart';
import '../bloc/BlocFav.dart';
import '../bloc/api/Api.dart';

import '../json/chambre.dart';
import '../main.dart';
import '../www/link.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Detailschambres extends StatefulWidget {
  final chambre C1;
  const Detailschambres({super.key, required this.C1});
  @override
  State<Detailschambres> createState() => _DetailschambresState();
}

class _DetailschambresState extends State<Detailschambres> {
  TextEditingController dateDebut = TextEditingController();
  TextEditingController dateFine = TextEditingController();
  DateTime? D1;
  DateTime? D2;
  Api crdu = Api();
  // methode de like ;
  // reservation Options :
  // void Function()? F1 = () async {
  //   var respons = await crd
  // };
  //
  bool test = false;
  int counterRaiting = 0;
  Future<String> nbrJadore() async {
    var respons = await crdu.getrequest("$linkLike/${widget.C1.idCh}");

    return respons["reslt"][0]['total'].toString();
  }

  void ajouterJadore() async {
    var respons = await crdu.postRequest("$ajouterLiek", {
      "user_id": Connect.getString("user_id"),
      "id_chambre": widget.C1.idCh.toString(),
    });
    if (respons["Etat"] == "Success") {
      print("Success");
    }
  }

  void suprimerJador() async {
    var respons = await crdu.postRequest(deleteLike, {
      "user_id": Connect.getString("user_id"),
      "id_chambre": widget.C1.idCh.toString(),
    });
    if (respons["Etat"] == "Success") {
      print("Success");
    }
  }

  Future<bool> vrfLike() async {
    var respons = await crdu.getrequest(
      "$leinvrfLike/${Connect.getString("user_id")}/${widget.C1.idCh.toString()}",
    );
    if (respons["Etat"] == "Success") {
      return true;
    } else {
      return false;
    }
  }
  //

  bool fav = false;
  void Wishlist() {
    if (context.read<Favorie>().Verifer(widget.C1) == true) {
      setState(() {
        fav = true;
      });
    } else {
      setState(() {
        fav = false;
      });
    }
  }

  Future<int> VrfEtoile() async {
    var resposn = await crdu.getrequest(
      "${NbrEtoile}/${Connect.getString("user_id")}/${widget.C1.idCh.toString()}",
    );
    // showDialog(
    //   context: context,
    //   builder: (BuildContext context) {
    //     return AlertDialog(content: Text("${resposn["Data"]}"));
    //   },
    // );
    return resposn["Data"];
  }

  Vrf() async {
    var resposn = await crdu.getrequest(
      "${NbrEtoile}/${Connect.getString("user_id")}/${widget.C1.idCh.toString()}",
    );
    // showDialog(
    //   context: context,
    //   builder: (BuildContext context) {
    //     return AlertDialog(content: Text("${resposn["Data"]}"));
    //   },
    // );
    setState(() {
      counterRaiting = resposn["Data"];
    });
  }

  void ajouterEtoile(int value) async {
    var respons = await crdu.getrequest(
      "${AjouterEtoile}/${Connect.getString("user_id")}/${widget.C1.idCh.toString()}/${value}",
    );
    setState(() {
      counterRaiting = Vrf();
    });
    print(respons);
  }

  void Update(int value) async {
    var respons = await crdu.getrequest(
      "${UpdateEtoile}/${Connect.getString("user_id")}/${widget.C1.idCh.toString()}/${value}",
    );
    setState(() {
      counterRaiting = Vrf();
    });
    print(respons);
  }

  Future<String> AvgEtoile() async {
    var respons = await crdu.getrequest("${lienAvg}/${widget.C1.idCh}");
    return respons["Etat"];
  }

  String Status = "disponible";
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    Wishlist();
    Vrf();
    setState(() {
      Status = widget.C1.status.toString();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,

          child: Column(
            children: [
              Stack(
                children: [
                  Positioned(
                    child: Container(
                      width: MediaQuery.of(context).size.width,
                      height: 320,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(30),
                          bottomRight: Radius.circular(30),
                        ),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(10),
                          bottomRight: Radius.circular(10),
                        ),
                        child: Image.network(
                          "${linkChambres}/${widget.C1.image}",
                          fit: BoxFit.fill,
                        ),
                      ),
                    ),
                  ),

                  Positioned(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                          icon: Icon(
                            Icons.west_rounded,
                            color: const Color.fromARGB(255, 255, 255, 255),
                          ),
                        ),
                        InkWell(
                          onTap: () {
                            if (context.read<Favorie>().Verifer(widget.C1) ==
                                true) {
                              context.read<Favorie>().deleteSanindex(widget.C1);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: Color(0xFFFF725E),
                                  content: Text(
                                    " Succès ! La chambre est désormais dans votre liste de favoris. ",
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                              );
                              Wishlist();
                            } else {
                              context.read<Favorie>().Add(widget.C1);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: Color(0xFFFF725E),
                                  content: Text(
                                    "${widget.C1.nomChambre} La chambre a été ajoutée à vos favoris.",
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                              );
                              Wishlist();
                            }
                          },
                          child:
                              (fav == false)
                                  ? Container(
                                    margin: EdgeInsets.only(right: 10),
                                    child: Image.asset(
                                      "lib/icons/wishlist.png",
                                      width: 21,
                                      height: 21,
                                      color: const Color.fromARGB(
                                        255,
                                        255,
                                        255,
                                        255,
                                      ),
                                    ),
                                  )
                                  : Container(
                                    margin: EdgeInsets.only(right: 10),
                                    child: Image.asset(
                                      "images/bookmark.png",
                                      width: 21,
                                      height: 21,
                                      color: const Color.fromARGB(
                                        255,
                                        255,
                                        255,
                                        255,
                                      ),
                                    ),
                                  ),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    bottom: 10,
                    left: 10,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Text(
                        "#${widget.C1.idCh}",
                        style: TextStyle(
                          color: const Color.fromARGB(255, 255, 255, 255),
                          fontFamily: "Font2",
                        ),
                      ),
                    ),
                  ),

                  FutureBuilder(
                    future: Future.wait([nbrJadore(), vrfLike()]),
                    builder: (BuildContext context, AsyncSnapshot snap) {
                      Future.delayed(Duration(seconds: 2), () {});
                      if (snap.connectionState == ConnectionState.waiting) {
                        return Positioned(
                          bottom: 10,
                          right: 10,
                          child: Container(
                            width: 10,
                            height: 10,
                            child: CircularProgressIndicator(
                              strokeWidth: 1,
                              color: Color(0xFFFF725E),
                            ),
                          ),
                        );
                      }

                      if (snap.hasData &&
                          snap.data != null &&
                          snap.data.isNotEmpty) {
                        return Positioned(
                          bottom: 0,
                          right: 10,
                          child: Row(
                            children: [
                              IconButton(
                                onPressed: () {
                                  if (snap.data[1] == true) {
                                    suprimerJador();
                                    setState(() {
                                      nbrJadore();
                                    });
                                  } else {
                                    ajouterJadore();
                                    setState(() {
                                      nbrJadore();
                                    });
                                  }
                                },
                                icon:
                                    (snap.data[1] == true)
                                        ? Icon(
                                          Icons.favorite,
                                          color: const Color.fromARGB(
                                            255,
                                            247,
                                            48,
                                            48,
                                          ).withOpacity(0.6),
                                        )
                                        : Icon(
                                          Icons.favorite_border_outlined,
                                          color: const Color.fromARGB(
                                            255,
                                            247,
                                            48,
                                            48,
                                          ).withOpacity(0.6),
                                        ),
                              ),
                              Text(
                                "${snap.data[0]}",
                                style: TextStyle(
                                  color: const Color.fromARGB(
                                    220,
                                    255,
                                    255,
                                    255,
                                  ),
                                  fontSize: 15,
                                  fontFamily: "Font2",
                                ),
                              ),
                            ],
                          ),
                        );
                      }

                      if (snap.hasError) {
                        return Center(
                          child: Text("Erreur de chargement des chambres"),
                        );
                      }
                      return Center(child: Text("Aucune data"));
                    },
                  ),
                ],
              ),
              SizedBox(height: 7),
              Container(
                width: MediaQuery.of(context).size.width,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Text(
                      "${widget.C1.nomChambre}",
                      style: TextStyle(fontFamily: "Font3"),
                    ),
                    SizedBox(width: 30),
                    Text(
                      "${widget.C1.type}",
                      style: TextStyle(
                        color: const Color.fromARGB(220, 148, 147, 147),
                        fontSize: 10,
                        fontFamily: "Font3",
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 15),
              Container(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(width: 19),
                        Image.asset("images/group.png", width: 25, height: 25),
                        Text("Capacité", style: TextStyle(fontFamily: "Font3")),
                        SizedBox(width: 1),
                        Text(
                          " : ${widget.C1.capacit} persson",
                          style: TextStyle(
                            fontFamily: "Font3",
                            color: const Color.fromARGB(220, 148, 147, 147),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(width: (Status == "maintenance") ? 70 : 90),
                    Container(
                      padding: EdgeInsets.symmetric(
                        vertical: 5,
                        horizontal: 12,
                      ),
                      decoration: BoxDecoration(
                        color:
                            (Status == "disponible")
                                ? const Color.fromARGB(
                                  169,
                                  7,
                                  255,
                                  23,
                                ).withOpacity(0.5)
                                : const Color.fromARGB(
                                  174,
                                  213,
                                  24,
                                  24,
                                ).withOpacity(0.7),
                        borderRadius: BorderRadius.all(Radius.circular(10)),
                      ),
                      child: Text(
                        "${Status}",
                        style: TextStyle(
                          color: const Color.fromARGB(255, 255, 255, 255),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 10),
              FutureBuilder(
                future: Future.wait([VrfEtoile(), AvgEtoile()]),
                builder: (BuildContext context, AsyncSnapshot snap) {
                  if (snap.hasData && snap.data != null) {
                    return Container(
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          SizedBox(width: 20),
                          InkWell(
                            onTap: () {
                              if (counterRaiting == 0) {
                                ajouterEtoile(1);
                              } else {
                                Update(1);
                              }
                            },
                            child:
                                (counterRaiting >= 1)
                                    ? Container(
                                      child: Image.asset(
                                        "images/startX.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    )
                                    : Container(
                                      child: Image.asset(
                                        "images/star.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    ),
                          ),
                          SizedBox(width: 5),
                          InkWell(
                            onTap: () {
                              if (counterRaiting == 0) {
                                ajouterEtoile(2);
                              } else {
                                Update(2);
                              }
                            },
                            child:
                                (counterRaiting >= 2)
                                    ? Container(
                                      child: Image.asset(
                                        "images/startX.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    )
                                    : Container(
                                      child: Image.asset(
                                        "images/star.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    ),
                          ),
                          SizedBox(width: 5),
                          InkWell(
                            onTap: () {
                              if (counterRaiting == 0) {
                                ajouterEtoile(3);
                              } else {
                                Update(3);
                              }
                            },
                            child:
                                (counterRaiting >= 3)
                                    ? Container(
                                      child: Image.asset(
                                        "images/startX.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    )
                                    : Container(
                                      child: Image.asset(
                                        "images/star.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    ),
                          ),
                          SizedBox(width: 5),
                          InkWell(
                            onTap: () {
                              if (counterRaiting == 0) {
                                ajouterEtoile(4);
                              } else {
                                Update(4);
                              }
                            },
                            child:
                                (counterRaiting >= 4)
                                    ? Container(
                                      child: Image.asset(
                                        "images/startX.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    )
                                    : Container(
                                      child: Image.asset(
                                        "images/star.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    ),
                          ),
                          SizedBox(width: 5),
                          InkWell(
                            onTap: () {
                              if (counterRaiting == 0) {
                                ajouterEtoile(5);
                              } else {
                                Update(5);
                              }
                            },
                            child:
                                (counterRaiting >= 5)
                                    ? Container(
                                      child: Image.asset(
                                        "images/startX.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    )
                                    : Container(
                                      child: Image.asset(
                                        "images/star.png",
                                        width: 20,
                                        height: 20,
                                        color: const Color.fromARGB(
                                          255,
                                          216,
                                          199,
                                          45,
                                        ).withOpacity(0.6),
                                      ),
                                    ),
                          ),
                          SizedBox(width: 10),
                          Text(
                            "${snap.data[1]}",
                            style: TextStyle(fontFamily: "Font1"),
                          ),
                        ],
                      ),
                    );
                  }
                  return Container();
                },
              ),

              SizedBox(
                height: 110,
                child: Column(
                  children: [
                    Text("A propose", style: TextStyle(fontFamily: "Font3")),
                    Container(
                      width: MediaQuery.of(context).size.width - 30,
                      height: 90,
                      child: ListView(
                        children: [
                          Text(
                            style: TextStyle(
                              color: const Color.fromARGB(220, 148, 147, 147),
                              fontSize: 15,
                              fontFamily: "Font3",
                            ),
                            "${widget.C1.description}",
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              Container(
                height: 84,

                width: MediaQuery.of(context).size.width,

                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.9),
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(15),
                    topRight: Radius.circular(15),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 50,
                      offset: Offset(0, 5),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "${widget.C1.prix}.00 DZD/Nuit",
                      style: TextStyle(
                        color: Color.fromARGB(255, 218, 185, 185),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Font4',
                      ),
                    ),
                    SizedBox(width: 10),
                    MaterialButton(
                      disabledElevation: 21,
                      enableFeedback: false,
                      padding: EdgeInsets.symmetric(
                        vertical: 11,
                        horizontal: 30,
                      ),

                      color: Color(0xFFFF725E),
                      onPressed:
                          (widget.C1.status == "disponible")
                              ? () {
                                showDialog(
                                  context: context,
                                  builder: (Context) {
                                    return AlertDialog(
                                      title: Container(
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Image.asset(
                                              "images/laptop.png",
                                              width: 25,
                                              height: 25,
                                            ),
                                            SizedBox(width: 10),
                                            Text(
                                              "reservation system",
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontFamily: "Font2",
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      content: Container(
                                        height: 150,
                                        child: Column(
                                          children: [
                                            SizedBox(
                                              width: 200,
                                              child: TextField(
                                                controller: dateDebut,
                                                onTap: () async {
                                                  DateTime?
                                                  temp = await showDatePicker(
                                                    context: context,
                                                    initialDate: DateTime.now(),
                                                    firstDate: DateTime(1999),
                                                    lastDate: DateTime(2050),
                                                  );
                                                  setState(() {
                                                    D1 = temp;
                                                    dateDebut.text =
                                                        temp.toString().split(
                                                          " ",
                                                        )[0];
                                                  });
                                                },
                                                readOnly: true,
                                                decoration: InputDecoration(
                                                  labelText: "Début",
                                                  labelStyle: TextStyle(
                                                    fontSize: 15,
                                                    fontFamily: "Font2",
                                                  ),
                                                  prefixIcon: Icon(
                                                    Icons.calendar_today,
                                                  ),
                                                  filled: true,
                                                ),
                                              ),
                                            ),
                                            SizedBox(height: 20),
                                            SizedBox(
                                              width: 200,
                                              child: TextField(
                                                controller: dateFine,
                                                onTap: () async {
                                                  DateTime?
                                                  temp = await showDatePicker(
                                                    context: context,
                                                    initialDate: DateTime.now(),
                                                    firstDate: DateTime(1999),
                                                    lastDate: DateTime(2050),
                                                  );
                                                  setState(() {
                                                    D2 = temp;
                                                    dateFine.text =
                                                        temp.toString().split(
                                                          " ",
                                                        )[0];
                                                  });
                                                },
                                                readOnly: true,
                                                decoration: InputDecoration(
                                                  labelText: "Fin",
                                                  labelStyle: TextStyle(
                                                    fontSize: 15,
                                                    fontFamily: "Font2",
                                                  ),
                                                  prefixIcon: Icon(
                                                    Icons.calendar_today,
                                                  ),
                                                  filled: true,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      actions: [
                                        MaterialButton(
                                          onPressed: () {
                                            Navigator.of(context).pop();
                                          },
                                          child: Text("Annuler"),
                                        ),
                                        MaterialButton(
                                          onPressed: () {
                                            int jours =
                                                (D1!.difference(D2!).inDays)
                                                    .abs();
                                            // ScaffoldMessenger.of(
                                            //   context,
                                            // ).showSnackBar(
                                            //   SnackBar(
                                            //     content: Text("${jours}"),
                                            //   ),
                                            // );

                                            Navigator.of(context).push(
                                              MaterialPageRoute(
                                                builder:
                                                    (route) => Test(
                                                      amount:
                                                          jours *
                                                          int.parse(
                                                            widget.C1.prix
                                                                .toString(),
                                                          ),
                                                      currency: "USD",
                                                      id_ch:
                                                          widget.C1.idCh
                                                              .toString(),
                                                      debut:
                                                          dateDebut.text
                                                              .toString(),
                                                      fin:
                                                          dateFine.text
                                                              .toString(),
                                                    ),
                                              ),
                                            );
                                          },
                                          child: Text("Ok"),
                                        ),
                                      ],
                                    );
                                  },
                                );
                              }
                              : null,
                      disabledColor: Color(0xFFFF725E).withOpacity(0.5),

                      child: Container(
                        decoration: BoxDecoration(),
                        child: Text(
                          "Réservation",
                          style: TextStyle(
                            fontFamily: "Font1",
                            fontSize: 20,
                            color: Color.fromARGB(255, 255, 255, 255),
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
    );
  }
}
