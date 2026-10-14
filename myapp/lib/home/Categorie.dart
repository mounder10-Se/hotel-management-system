import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../bloc/api/Api.dart';
import '../components/Boxproperty.dart';
import 'detailschambres.dart';
import '../json/chambre.dart';
import '../www/link.dart';

class Categorie extends StatefulWidget {
  final String Type;
  const Categorie({super.key, required this.Type});

  @override
  State<Categorie> createState() => _CategorieState();
}

class _CategorieState extends State<Categorie> {
  String? nbr;
  Api crdu = Api();

  getType() async {
    var respons = await crdu.postRequest(lienCategorie, {
      "type": widget.Type.toString(),
    });
    setState(() {
      nbr = respons["Nombre"].toString();
    });
    return respons;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          // color: Colors.amber,
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Stack(
            children: [
              Positioned(
                top: 10,
                left: 2,
                child: Container(
                  // margin: EdgeInsets.symmetric(vertical: 10, horizontal: 10),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          IconButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            icon: Icon(
                              Icons.arrow_back_rounded,
                              color: const Color.fromARGB(255, 0, 0, 0),
                              size: 24,
                            ),
                          ),
                          SizedBox(width: 3),
                          Text(
                            "Catégories",
                            style: TextStyle(
                              color: const Color.fromARGB(255, 0, 0, 0),
                              fontSize: 23,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        margin: EdgeInsets.symmetric(
                          vertical: 4,
                          horizontal: 4,
                        ),
                        child: Text(
                          "${nbr} chambres ${widget.Type}",
                          style: TextStyle(
                            color: const Color.fromARGB(255, 158, 158, 158),
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              FutureBuilder(
                future: getType(),
                builder: (BuildContext context, AsyncSnapshot snap) {
                  if (snap.hasData && snap.data != null) {
                    return Positioned(
                      top: 94,
                      child: Container(
                        width: MediaQuery.of(context).size.width - 10,
                        height: MediaQuery.of(context).size.height -128,
                        child: ListView.builder(
                          shrinkWrap: true,
                          itemCount: snap.data["Data"].length,
                          itemBuilder: (context, index) {
                            return Property(
                              F1: () {
                                Navigator.of(context).push(
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
                        ),
                      ),
                    );
                  }
                  return Center(child: Text("Aucune data "));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
