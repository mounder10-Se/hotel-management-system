import 'package:flutter/material.dart';
import '../bloc/api/Api.dart';

import '../json/chambre.dart';
import '../www/link.dart';

class Property extends StatefulWidget {
  final chambre property;
  final Function()? F1;

  const Property({super.key, required this.property, required this.F1});

  @override
  _PropertyState createState() => _PropertyState();
}

class _PropertyState extends State<Property> {
  Api crdu = Api();
  String? nbrEt;
  AvgEtoile() async {
    var respons = await crdu.getrequest("${lienAvg}/${widget.property.idCh}");
    //     showDialog(
    //   context: context,
    //   builder: (BuildContext context) {
    //     return AlertDialog(content: Text("${widget.property.prix}"));
    //   },
    // );
    return respons["Etat"];
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.F1,
      child: Container(
        margin: EdgeInsets.all(5),
        padding: EdgeInsets.all(10),
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              blurRadius: 5,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    "$linkChambres/${widget.property.image}",
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  top: 5,
                  left: 5,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Text(
                      "#${widget.property.idCh}",
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "${widget.property.nomChambre}",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5),
                  FutureBuilder(
                    future: AvgEtoile(),
                    builder: (BuildContext context, AsyncSnapshot snap) {
                      if (snap.data != null && snap.hasData) {
                        return Row(
                          children: [
                            Icon(Icons.star, color: Colors.yellow, size: 18),
                            SizedBox(width: 3),
                            Text(
                              "${snap.data}",
                              style: TextStyle(fontSize: 14),
                            ),
                          ],
                        );
                      }
                      return Text("");
                    },
                  ),

                  SizedBox(height: 5),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Text(
                      "${widget.property.type}",
                      style: TextStyle(color: Colors.blue, fontSize: 14),
                    ),
                  ),
                  SizedBox(height: 5),
                  Row(
                    children: [
                      Icon(Icons.supervised_user_circle_outlined, size: 18),
                      SizedBox(width: 5),
                      Text(
                        "Capacity: ${widget.property.capacit} persons",
                        style: TextStyle(fontSize: 14),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
