import 'package:flutter/material.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'BlocFav.dart';
import '../components/BoxList.dart';
import '../json/chambre.dart';

class list extends StatefulWidget {
  const list({super.key});

  @override
  State<list> createState() => _listState();
}

class _listState extends State<list> {
  int T1 = 0;
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    setState(() {
      T1 = context.read<Favorie>().tailleList();
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
              Align(
                alignment: Alignment.topLeft,
                child: Container(
                  padding: EdgeInsets.symmetric(vertical: 10, horizontal: 10),
                  child: Text(
                    "list de favoris",
                    style: TextStyle(fontFamily: 'Font3', fontSize: 25),
                  ),
                ),
              ),

              Align(
                alignment: Alignment.topLeft,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    "Votre liste de ${T1} favoris est ici.",
                    style: TextStyle(
                      fontFamily: 'Font3',
                      fontSize: 15,
                      color: const Color.fromARGB(255, 154, 154, 154),
                    ),
                  ),
                ),
              ),

              BlocBuilder<Favorie, List<chambre>>(
                builder: (context, val) {
                  if (val.isEmpty) {
                    return Container(
                      margin: EdgeInsets.only(top: 200),
                      child: Text(
                        "aucune chambre dans list favoris",
                        style: TextStyle(fontFamily: 'Font3', fontSize: 20),
                      ),
                    );
                  } else {
                    return Container(
                      height: MediaQuery.of(context).size.height-(168),
                      child: ListView.builder(
                        shrinkWrap: true,
                        itemCount: val.length,
                        itemBuilder: (context, index) {
                          return BoxF(
                            C1: val[index],
                            F1: () {
                              context.read<Favorie>().deleteChambre(index);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  backgroundColor: Color(0xFFFF725E),
                                  content: Text(
                                    "${val[index].nomChambre} est suprimer",
                                    style: TextStyle(fontSize: 12),
                                  ),
                                ),
                              );
                              setState(() {
                                T1 = context.read<Favorie>().tailleList();
                              });
                            },
                          );
                        },
                      ),
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
