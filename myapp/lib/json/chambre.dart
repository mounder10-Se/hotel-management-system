class chambre {
  int? idCh;
  String? status;
  String? nomChambre;
  String? image;
  String? type;
  int? capacit;
  int? prix;
  String? description;

  chambre(
      {this.idCh,
      this.status,
      this.nomChambre,
      this.image,
      this.type,
      this.capacit,
      this.prix,
      this.description});

  chambre.fromJson(Map<String, dynamic> json) {
    idCh = json['id_ch'];
    status = json['status'];
    nomChambre = json['nom_chambre'];
    image = json['image'];
    type = json['type'];
    capacit = json['capacité'];
    prix = json['prix'];
    description = json['description'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id_ch'] = this.idCh;
    data['status'] = this.status;
    data['nom_chambre'] = this.nomChambre;
    data['image'] = this.image;
    data['type'] = this.type;
    data['capacité'] = this.capacit;
    data['prix'] = this.prix;
    data['description'] = this.description;
    return data;
  }
  // pour verifier deux objet de type chambres
  @override
bool operator ==(Object other) {
  if (identical(this, other)) return true;
  if (other is! chambre) return false;
  return idCh == other.idCh;
}
@override
int get hashCode => idCh.hashCode;

}