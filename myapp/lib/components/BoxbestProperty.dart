import 'package:flutter/material.dart';
import '../bloc/api/Api.dart';
import '../json/chambre.dart';
import '../www/link.dart';


class best extends StatefulWidget {
  final chambre property;
  final Function()? F1;

  const best({super.key, required this.property, required this.F1});

  @override
  State<best> createState() => _bestState();
}

class _bestState extends State<best> {
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
        width: 150,
        height: 10,

        margin: EdgeInsets.symmetric(horizontal: 10, vertical: 7),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(40)),
        ),
        child: Stack(
          children: [
            Positioned(
              child: ClipRRect(
                borderRadius: BorderRadius.all(Radius.circular(10)),
                child: Image.network(
                  "$linkChambres/${widget.property.image}",
                  fit: BoxFit.fill,
                ),
              ),
            ),
            Positioned(
              bottom: 5,
              left: 5,
              child: Container(
                width: 43,
                height: 30,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(
                    255,
                    199,
                    198,
                    198,
                  ).withOpacity(0.6),
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Icon(Icons.star, color: Colors.yellow, size: 16),
                    FutureBuilder(
                      future: AvgEtoile(),
                      builder: (BuildContext context, AsyncSnapshot snap) {
                        if (snap.data != null && snap.hasData) {
                          return Text(
                            "${snap.data}",
                            style: TextStyle(fontSize: 13),
                          );
                        }
                        return Text("");
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
