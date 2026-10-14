import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../bloc/api/Api.dart';
import '../components/BoxbestProperty.dart';
import '../components/Boxproperty.dart';
import 'Categorie.dart';
import 'detailschambres.dart';
import '../json/chambre.dart';
import '../main.dart';
import '../www/link.dart';

class Home extends StatefulWidget {
  const Home({super.key});
  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  TextEditingController search = TextEditingController();
  Api crdu = Api();
  GlobalKey<ScaffoldState> DR = GlobalKey();
  int Select = 0;
  final refreshKey = GlobalKey<RefreshIndicatorState>();

  // Define consistent colors
  final Color primaryColor = Color.fromARGB(255, 218, 185, 185);
  final Color secondaryColor = Color.fromARGB(255, 207, 196, 222);

  getBestChambre() async {
    var respons = await crdu.getrequest("$lienbest");
    return respons["Etat"];
  }

  getUser() async {
    var respons = await crdu.getrequest(
      '$leinUser/${Connect.getString("user_id")}',
    );
    return respons;
  }

  getChambres() async {
    var respons = await crdu.getrequest(lienallchambres);
    return respons;
  }

  informationClient() async {
    var respons = await crdu.getrequest(
      "${leinUser}/${Connect.getString("user_id")}",
    );
    return respons;
  }

  Future<void> _handleRefresh() async {
    setState(() {});
    try {
      await Future.wait<dynamic>([
        getBestChambre(),
        getChambres(),
        informationClient(),
      ]);
    } catch (e) {
      print('Error refreshing data: $e');
    }
  }

  Widget _buildProfileImage(AsyncSnapshot snap) {
    if (snap.connectionState == ConnectionState.waiting) {
      return Container(
        width: 36,
        height: 36,
        padding: EdgeInsets.all(8),
        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
      );
    }

    if (!snap.hasData ||
        snap.data == null ||
        snap.data[0]["Data"]["image"] == null) {
      return Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          shape: BoxShape.circle,
        ),
        child: Icon(Icons.person, color: Colors.white, size: 20),
      );
    }

    return ClipOval(
      child: Image.network(
        "$linkImages/${snap.data[0]["Data"]["image"]}",
        width: 36,
        height: 36,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.person, color: Colors.white, size: 20),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: DR,
      appBar: PreferredSize(
        preferredSize: Size(double.infinity, 57),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [primaryColor, secondaryColor],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 4,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            toolbarHeight: 70,
            leading: Container(
              margin: EdgeInsets.only(left: 10),
              child: PopupMenuButton(
                position: PopupMenuPosition.under,
                icon: Icon(Icons.menu, color: Colors.white),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                tooltip: "Options",
                itemBuilder:
                    (context) => [
                      PopupMenuItem(
                        child: Row(
                          children: [
                            Icon(Icons.settings, size: 20),
                            SizedBox(width: 8),
                            Text(
                              "Paramètres",
                              style: TextStyle(
                                fontFamily: "Font3",
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        onTap: () {
                          Connect.clear();
                          Navigator.of(context).pushNamedAndRemoveUntil(
                            '/singIn',
                            (route) => false,
                          );
                        },
                        child: Row(
                          children: [
                            Icon(Icons.logout, size: 20, color: Colors.red),
                            SizedBox(width: 8),
                            Text(
                              "Déconnecter",
                              style: TextStyle(
                                fontFamily: "Font3",
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
              ),
            ),
            title: Text(
              "Découvrir",
              style: TextStyle(
                fontFamily: "Font3",
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            centerTitle: true,
            actions: [
              Container(
                margin: EdgeInsets.only(right: 10),
                child: FutureBuilder(
                  future: informationClient(),
                  builder: (BuildContext context, AsyncSnapshot snap) {
                    return Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                      child: CircleAvatar(
                        radius: 18,
                        backgroundColor: Colors.transparent,
                        child: _buildProfileImage(snap),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      body: RefreshIndicator(
        key: refreshKey,
        onRefresh: _handleRefresh,
        color: primaryColor,
        backgroundColor: Colors.white,
        strokeWidth: 2.5,
        displacement: 20,
        child: SizedBox(
          height: MediaQuery.of(context).size.height - 150,
          child: ListView(
            physics: AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            shrinkWrap: true,
            children: [
              Column(
                children: [
                  SizedBox(height: 10),

                  // Categories section with consistent styling
                  Container(
                    margin: EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          child: Text(
                            "Catégories :",
                            style: TextStyle(
                              fontFamily: "Font3",
                              fontWeight: FontWeight.bold,
                              fontSize: 22,
                            ),
                          ),
                        ),
                        Container(
                          height: 40,

                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            children: [
                              _buildCategoryItem(
                                "Standard",
                                "images/bed.png",
                                () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) =>
                                              Categorie(Type: "standard"),
                                    ),
                                  );
                                },
                              ),
                              _buildCategoryItem(
                                "Luxe",
                                "images/vip-room.png",
                                () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => Categorie(Type: "Luxe"),
                                    ),
                                  );
                                },
                              ),
                              _buildCategoryItem(
                                "Familiale",
                                "images/parents.png",
                                () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) =>
                                              Categorie(Type: "Familiale"),
                                    ),
                                  );
                                },
                              ),
                              _buildCategoryItem(
                                "Suite",
                                "images/all-inclusive.png",
                                () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => Categorie(Type: "suite"),
                                    ),
                                  );
                                },
                              ),
                              _buildCategoryItem(
                                "Lune de miel",
                                "images/travel.png",
                                () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) =>
                                              Categorie(Type: "Lune de Miel"),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Best rated section
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 15, vertical: 10),
                    child: Row(
                      children: [
                        Text(
                          "Les mieux notés :",
                          style: TextStyle(
                            fontFamily: "Font3",
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Best rated items
                  SizedBox(
                    width: MediaQuery.of(context).size.width,
                    height: 100,
                    child: FutureBuilder(
                      future: getBestChambre(),
                      builder: (BuildContext context, AsyncSnapshot snap) {
                        if (snap.connectionState == ConnectionState.waiting) {
                          return Center(
                            child: CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                primaryColor,
                              ),
                            ),
                          );
                        }
                        if (snap.hasData && snap.data != null) {
                          return ListView.builder(
                            shrinkWrap: true,
                            scrollDirection: Axis.horizontal,
                            itemCount: snap.data.length,
                            itemBuilder: (context, index) {
                              return best(
                                property: chambre.fromJson(snap.data[index]),
                                F1: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => Detailschambres(
                                            C1: chambre.fromJson(
                                              snap.data[index],
                                            ),
                                          ),
                                    ),
                                  );
                                },
                              );
                            },
                          );
                        }
                        return Center(
                          child: Text(
                            "Aucune chambre disponible",
                            style: TextStyle(
                              fontFamily: "Font3",
                              color: Colors.grey,
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  SizedBox(height: 7),

                  // All rooms list
                  Container(
                    child: FutureBuilder(
                      future: getChambres(),
                      builder: (context, AsyncSnapshot snap) {
                        if (snap.connectionState == ConnectionState.waiting) {
                          return Center(
                            child: CircularProgressIndicator(
                              valueColor: AlwaysStoppedAnimation<Color>(
                                primaryColor,
                              ),
                            ),
                          );
                        }
                        if (snap.hasError) {
                          return Center(
                            child: Text(
                              "Erreur de chargement des chambres",
                              style: TextStyle(
                                fontFamily: "Font3",
                                color: Colors.red,
                              ),
                            ),
                          );
                        }
                        if (snap.hasData &&
                            snap.data["Data"] != null &&
                            snap.data["Data"].isNotEmpty) {
                          return ListView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemCount: snap.data["Data"].length,
                            itemBuilder: (context, index) {
                              return Property(
                                F1: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => Detailschambres(
                                            C1: chambre.fromJson(
                                              snap.data["Data"][index],
                                            ),
                                          ),
                                    ),
                                  );
                                },
                                property: chambre.fromJson(
                                  snap.data["Data"][index],
                                ),
                              );
                            },
                          );
                        }
                        return Center(
                          child: Text(
                            "Aucune chambre disponible",
                            style: TextStyle(
                              fontFamily: "Font3",
                              color: Colors.grey,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryItem(
    String title,
    String imagePath,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: 110,
        margin: EdgeInsets.symmetric(horizontal: 5),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [primaryColor, secondaryColor],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(imagePath, width: 24, height: 24, color: Colors.white),
            SizedBox(width: 8),
            Flexible(
              child: Text(
                title,
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: "Font3",
                  fontSize: 13,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
