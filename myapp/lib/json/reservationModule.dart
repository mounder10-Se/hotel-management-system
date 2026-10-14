class reservation {
  int? idReservation;
  int? idPersson;
  int? idChambre;
  String? dateDebut;
  String? dateFin;

  reservation(
      {this.idReservation,
      this.idPersson,
      this.idChambre,
      this.dateDebut,
      this.dateFin});

  reservation.fromJson(Map<String, dynamic> json) {
    idReservation = json['id_reservation'];
    idPersson = json['id_persson'];
    idChambre = json['id_chambre'];
    dateDebut = json['date_debut'];
    dateFin = json['date_fin'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id_reservation'] = this.idReservation;
    data['id_persson'] = this.idPersson;
    data['id_chambre'] = this.idChambre;
    data['date_debut'] = this.dateDebut;
    data['date_fin'] = this.dateFin;
    return data;
  }
}


