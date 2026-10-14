import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:myapp/home/reservation.dart';
import '../bloc/api/Api.dart';
import '../bloc/wishlist.dart';
import 'Home.dart';
import 'Profil.dart';
import '../main.dart';
import '../www/link.dart';

class principale extends StatefulWidget {
  const principale({super.key});

  @override
  State<principale> createState() => _principaleState();
}

class _principaleState extends State<principale> {
  Api crdu = Api();
  GlobalKey<ScaffoldState> DR = GlobalKey();
  int Select = 0;

  getUser() async {
    var respons = await crdu.getrequest(
      '$leinUser/${Connect.getString("user_id")}',
    );
    return respons;
  }

  List<Widget> ListNavigations = [Home(), list(), Reservation(), Profil()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Contenue qui aficher Dans la page :
          Positioned.fill(child: SafeArea(child: ListNavigations[Select])),

          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 68,
              // margin: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.9),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                  // bottomLeft: Radius.circular(20),
                  // bottomRight: Radius.circular(20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 20,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: BottomNavigationBar(
                  enableFeedback: false,
                  elevation: 0,
                  mouseCursor: MouseCursor.uncontrolled,
                  // useLegacyColorScheme: true,
                  // backgroundColor: Colors.transparent,
                  showSelectedLabels: false,
                  iconSize: 6,
                  showUnselectedLabels: false,
                  selectedItemColor: Colors.black,
                  unselectedItemColor: Colors.grey,
                  type: BottomNavigationBarType.fixed,

                  currentIndex: Select,
                  onTap: (index) {
                    setState(() {
                      Select = index;
                    });
                  },
                  items: [
                    BottomNavigationBarItem(
                      icon: Container(
                        padding: EdgeInsets.all(10),

                        decoration: BoxDecoration(
                          color:
                              Select == 0 ? Colors.black : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Image.asset(
                          "lib/icons/home.png",
                          height: 13,
                          color: Select == 0 ? Colors.white : Colors.black,
                        ),
                      ),
                      label: "",
                    ),
                    BottomNavigationBarItem(
                      icon: Container(
                        padding: EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color:
                              Select == 1 ? Colors.black : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Image.asset(
                          "lib/icons/wishlist.png",
                          height: 13,
                          color: Select == 1 ? Colors.white : Colors.black,
                        ),
                      ),
                      label: "",
                    ),
                    BottomNavigationBarItem(
                      icon: Container(
                        padding: EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color:
                              Select == 2 ? Colors.black : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Image.asset(
                          "lib/icons/credit-card.png",
                          height: 13,
                          color: Select == 2 ? Colors.white : Colors.black,
                        ),
                      ),
                      label: "",
                    ),
                    BottomNavigationBarItem(
                      icon: Container(
                        padding: EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color:
                              Select == 3 ? Colors.black : Colors.transparent,
                          shape: BoxShape.circle,
                        ),
                        child: Image.asset(
                          "lib/icons/user.png",
                          height: 13,
                          color:
                              Select == 3
                                  ? const Color.fromARGB(255, 255, 255, 255)
                                  : Colors.black,
                        ),
                      ),
                      label: "",
                    ),
                  ],
                ),
              ),
            ),
          ),
          //
        ],
      ),
    );
  }
}
