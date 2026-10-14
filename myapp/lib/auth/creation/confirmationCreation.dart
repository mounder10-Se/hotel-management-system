import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:myapp/auth/creation/selectionerImage.dart';
import 'package:myapp/bloc/api/Api.dart';

import 'package:myapp/www/link.dart';

class Confirmationcreation extends StatefulWidget {
  final String email;
  final String nom;
  final String prenom;
  final String password;
  final String telephone;
  const Confirmationcreation({
    super.key,
    required this.email,
    required this.nom,
    required this.prenom,
    required this.telephone,
    required this.password,
  });

  @override
  State<Confirmationcreation> createState() => _ConfirmationcreationState();
}

class _ConfirmationcreationState extends State<Confirmationcreation> {
  GlobalKey<FormState> key = GlobalKey();
  TextEditingController code = TextEditingController();
  Api api = Api();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> confirmation() async {
    if (code.text.isEmpty) {
      setState(() => _errorMessage = "Veuillez entrer le code de vérification");
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      var respons = await api
          .postRequest("$lienVerification/${code.text.toString()}", {
            "email": widget.email,
            "password": widget.password,
            "nom": widget.nom,
            "prenom": widget.prenom,
            "telephone": widget.telephone,
          });

      if (mounted) {
        if (respons != null && respons["Etat"] == "Success") {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder:
                  (context) =>
            ProfileImageSetup(userId: respons["id_user"].toString())
            ),
          );
        } else {
          setState(
            () =>
                _errorMessage = respons?["Etat"] ?? "Une erreur s'est produite",
          );
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = "Erreur de connexion au serveur");
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Arrière-plan SVG
          Positioned(
            child: SvgPicture.asset("images/back1.svg", fit: BoxFit.cover),
          ),
          // Contenu principal
          SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Bouton retour
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: SvgPicture.asset(
                          "images/Vector1.svg",
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),
                    // En-tête
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Vérification",
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              fontFamily: "Font4",
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            "Nous avons envoyé un code à ${widget.email}",
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                              height: 1.5,
                            ),
                          ),
                          if (_errorMessage != null) ...[
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.error_outline,
                                    color: Colors.red[700],
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _errorMessage!,
                                      style: TextStyle(
                                        color: Colors.red[700],
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          const SizedBox(height: 24),
                          // Champ de code
                          TextFormField(
                            controller: code,
                            style: const TextStyle(
                              fontSize: 20,
                              letterSpacing: 8,
                              fontWeight: FontWeight.bold,
                            ),
                            decoration: InputDecoration(
                              hintText: "• • • • • •",
                              filled: true,
                              fillColor: Colors.grey[100],
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(16),
                                borderSide: BorderSide.none,
                              ),
                              prefixIcon: Icon(
                                Icons.lock_outline,
                                color: Theme.of(context).primaryColor,
                              ),
                              hintStyle: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 20,
                                letterSpacing: 8,
                              ),
                            ),
                            textAlign: TextAlign.center,
                            keyboardType: TextInputType.number,
                            maxLength: 6,
                            onChanged:
                                (_) => setState(() => _errorMessage = null),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Bouton de confirmation
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : confirmation,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFA855F7),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 2,
                        ),
                        child:
                            _isLoading
                                ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                )
                                : const Text(
                                  "Vérifier",
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    // Bouton renvoyer le code
                    Center(
                      child: TextButton.icon(
                        onPressed:
                            _isLoading
                                ? null
                                : () {
             
                                },
                        icon: const Icon(Icons.refresh, size: 18),
                        label: const Text(
                          "Renvoyer le code",
                          style: TextStyle(fontSize: 14),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
