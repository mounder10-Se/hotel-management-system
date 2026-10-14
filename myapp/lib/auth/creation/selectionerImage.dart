import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:image_picker/image_picker.dart';
import 'package:myapp/bloc/api/Api.dart';
import 'package:myapp/main.dart';
import 'package:myapp/www/link.dart';

class ProfileImageSetup extends StatefulWidget {
  final String userId;

  const ProfileImageSetup({Key? key, required this.userId}) : super(key: key);

  @override
  State<ProfileImageSetup> createState() => _ProfileImageSetupState();
}

class _ProfileImageSetupState extends State<ProfileImageSetup>
    with SingleTickerProviderStateMixin {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  bool _isLoading = false;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1000,
        maxHeight: 1000,
        imageQuality: 85,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      debugPrint('Erreur lors de la sélection de l\'image: $e');
    }
  }

  Future<void> _uploadImage() async {
    if (_selectedImage == null) return;

    setState(() => _isLoading = true);
    try {
      final api = Api();
      print("id user est ${widget.userId}");
      // var response = await api.postRequest("", {"image": _selectedImage!.path});
      var respons = await api.postFile(leintajouterPicture, {
        "id_user": widget.userId,
      }, _selectedImage!);
      if (mounted) {
        if (respons != null && respons["Etat"] == "Success") {
          Connect.setString("user_id", respons["id_user"]);
          Navigator.of(context).pushReplacementNamed(
            '/principale',
          ); // Remplacez par votre route principale
        } else {
          _showError("Erreur lors de l'upload de l'image");
        }
      }
    } catch (e) {
      if (mounted) {
        _showError("Erreur de connexion");
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _skipImageSelection() {
    Navigator.of(context).pushReplacementNamed(
      '/principale',
    ); // Remplacez par votre route principale
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
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
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      // Titre
                      Text(
                        "Ajouter une photo de profil",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).primaryColor,
                          fontFamily: "Font4",
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        "Choisissez une photo qui vous représente",
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 40),
                      // Zone de l'image
                      GestureDetector(
                        onTap: _isLoading ? null : _pickImage,
                        child: Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                            image:
                                _selectedImage != null
                                    ? DecorationImage(
                                      image: FileImage(_selectedImage!),
                                      fit: BoxFit.cover,
                                    )
                                    : null,
                          ),
                          child:
                              _selectedImage == null
                                  ? Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.add_a_photo,
                                        size: 50,
                                        color: Theme.of(
                                          context,
                                        ).primaryColor.withOpacity(0.5),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        "Ajouter une photo",
                                        style: TextStyle(
                                          color: Theme.of(
                                            context,
                                          ).primaryColor.withOpacity(0.5),
                                          fontSize: 16,
                                        ),
                                      ),
                                    ],
                                  )
                                  : null,
                        ),
                      ),
                      const SizedBox(height: 40),
                      // Boutons
                      if (_selectedImage != null) ...[
                        SizedBox(
                          width: double.infinity,
                          height: 55,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _uploadImage,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFA855F7),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                              elevation: 2,
                            ),
                            child:
                                _isLoading
                                    ? const SizedBox(
                                      height: 25,
                                      width: 25,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                              Colors.white,
                                            ),
                                      ),
                                    )
                                    : const Text(
                                      "Utiliser cette photo",
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextButton(
                          onPressed: _isLoading ? null : _pickImage,
                          child: const Text(
                            "Choisir une autre photo",
                            style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ],
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: _isLoading ? null : _skipImageSelection,
                        child: const Text(
                          "Ignorer cette étape",
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
