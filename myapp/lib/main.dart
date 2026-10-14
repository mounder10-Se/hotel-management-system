import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/auth/login/SingIn.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'auth/login/Login.dart';
import 'bloc/BlocFav.dart';
import 'home/Home.dart';
import 'home/principale.dart';

late SharedPreferences Connect;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Connect = await SharedPreferences.getInstance();

  runApp(BlocProvider(create: (_) => Favorie(), child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(fontFamily: "Font1"),
      debugShowCheckedModeBanner: false,
      initialRoute:
          (Connect.getString("user_id") != null) ? "/principale" : "/singIn",
      // initialRoute: "/singIn",
      routes: {
        "/Home": (context) => Home(),
        "/login": (context) => const Login(),
        "/principale": (context) => const principale(),
        // "/test": (context) => const Test(),
        "/singIn": (context) => const Singin(),
        // "/categorie" : (context) => Categorie(Type: "Luxe")
        // "/gestionProfile":(context)=> const Gestionprofile(),
      },
    );
  }
}
