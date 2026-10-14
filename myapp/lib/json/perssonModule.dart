class persson {
  int? idUser;
  String? name;
  String? prenom;
  String? email;
  String? password;
  String? role;
  String? image;
  int? numero;

  persson(
      {this.idUser,
      this.name,
      this.prenom,
      this.email,
      this.password,
      this.role,
      this.image,
      this.numero});

  persson.fromJson(Map<String, dynamic> json) {
    idUser = json['id_user'];
    name = json['name'];
    prenom = json['prenom'];
    email = json['email'];
    password = json['password'];
    role = json['Role'];
    image = json['image'];
    numero = json['numero'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id_user'] = this.idUser;
    data['name'] = this.name;
    data['prenom'] = this.prenom;
    data['email'] = this.email;
    data['password'] = this.password;
    data['Role'] = this.role;
    data['image'] = this.image;
    data['numero'] = this.numero;
    return data;
  }
}