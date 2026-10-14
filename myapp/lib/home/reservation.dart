import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:myapp/bloc/api/Api.dart';
import 'package:myapp/components/Boxreservations.dart';
import 'package:myapp/json/reservationModule.dart';

import 'package:myapp/main.dart';
import 'package:myapp/www/link.dart';

class Reservation extends StatefulWidget {
  const Reservation({super.key});

  @override
  State<Reservation> createState() => _ReservationState();
}

class _ReservationState extends State<Reservation> {
  Api crdu = Api();
  informationClient() async {
    var respons = await crdu.getrequest(
      "${leinUser}/${Connect.getString("user_id")}",
    );
    return respons;
  }

  toutRservation() async {
    var respons = await crdu.getrequest(
      "$lienShow/${Connect.getString("user_id")}",
    );
    return respons;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size(double.infinity, 57),
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
          child: AppBar(
            leadingWidth: 300,
            
            backgroundColor: Colors.transparent,
            leading: Container(
              margin: EdgeInsets.only(left: 10),
              child: Row(
                children: [
                  PopupMenuButton(
                    position: PopupMenuPosition.under,
                    icon: Icon(Icons.menu),
                    iconColor: Colors.white,
                    borderRadius: BorderRadius.all(Radius.circular(50)),
                    offset: Offset(10, 10),
                    tooltip: "options",
                    itemBuilder:
                        (context) => [
                          PopupMenuItem(child: Text("paiment")),

                          PopupMenuItem(
                            onTap: () {
                              Connect.clear();
                              Navigator.of(context).pushNamedAndRemoveUntil(
                                '/login',
                                (route) => false,
                              );
                            },
                            child: Text("se déconnecter"),
                          ),
                        ],
                  ),
                  SizedBox(width: 15),
                  Text(
                    "mes réservations",
                    style: TextStyle(fontFamily: 'Font3', fontSize: 20 , fontWeight: FontWeight.bold , color: Colors.white ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: Container(
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height - (150),
          child: FutureBuilder(
            future: toutRservation(),
            builder: (BuildContext context, AsyncSnapshot snap) {
              if (snap.connectionState == ConnectionState.waiting) {
                return CircularProgressIndicator(
                  strokeWidth: 2,
                  color: Colors.blue,
                );
              }
              if (snap.hasData && snap.data != null) {
                return ListView.builder(
                  itemCount: snap.data["Data"].length,
                  itemBuilder: (context, index) {
                    return Boxreservations(
                      R1: reservation.fromJson(snap.data["Data"][index]),
                    );
                  },
                );
              }
              return Center(child: Text("Aucune reservation pour le moument"));
            },
          ),
        ),
      ),
    );
  }
}
