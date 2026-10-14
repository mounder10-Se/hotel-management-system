
import 'package:bloc/bloc.dart';
import '../json/chambre.dart';

class Favorie extends Cubit<List<chambre>> {
  Favorie() : super([]);

  bool Add(chambre value) {
    var myList = [...state];
    if (myList.contains(value) == false) {
      myList.add(value);
      emit(myList);
      return true;
    } else {
      return false;
    }
  }

  bool deleteChambre(int index) {
    var mylist = [...state];
    mylist.removeAt(index);
    emit(mylist);
    return true;
  }

  bool Verifer(chambre value) {
    var C1 = [...state];
    if (C1.contains(value)) {
      return true;
    } else {
      return false;
    }
  }

  void deleteSanindex(chambre value) {
    var Del = [...state];
    int indexValue = Del.indexOf(value);
    Del.removeAt(indexValue);
    emit(Del);
  }

  int tailleList() {
    var myList = [...state];
    return myList.length;
  }
}
