import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:myapp/main.dart';
import 'package:webview_flutter/webview_flutter.dart';

class Test extends StatefulWidget {
  const Test({
    super.key,
    required this.amount,
    required this.currency,
    required this.id_ch,
    required this.debut,
    required this.fin,
  });
  final int amount;
  final String currency;
  final String id_ch;
  final String debut;
  final String fin;
  @override
  State<Test> createState() => _TestState();
}

class _TestState extends State<Test> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();

    _controller =
        WebViewController()
          ..setJavaScriptMode(JavaScriptMode.unrestricted)
          ..setNavigationDelegate(
            NavigationDelegate(
              onNavigationRequest: (request) async {
                if (request.url.contains("http://return_url/?status=success")) {
                  Navigator.of(context).pushNamed("/principale");
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        title: Container(
                          child: Image.asset(
                            "images/checked.png",
                            width: 40,
                            height: 40,
                          ),
                        ),
                        content: Container(
                          child: Text(
                            "la demande de reserver cette chambre est fait avec success",
                          ),
                        ),
                        actions: [
                          InkWell(
                            onTap: () {
                              Navigator.of(context).pop();
                            },
                            child: Text("OK"),
                          ),
                        ],
                      );
                    },
                  );
                }
                if (request.url.contains("http://cancel_url")) {
                  Navigator.of(context).pop();
                }
                return NavigationDecision.navigate;
              },
              onPageStarted: (String url) {
                setState(() {
                  _isLoading = true;
                });
              },
              onPageFinished: (String url) {
                setState(() {
                  _isLoading = false;
                });
              },
              onWebResourceError: (WebResourceError error) {
                debugPrint('WebView Error: ${error.description}');
              },
            ),
          )
          ..loadRequest(
            Uri.parse(
               "http://192.168.70.25:3000/Mobile/createpaypalpayment/"
  "${widget.amount}/"
  "${widget.currency}/"
  "${Connect.getString("user_id")}/"
  "${widget.id_ch}/"
  "${widget.debut}/"
  "${widget.fin}"
            ),
          );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Reservation")),
      body: Stack(
        children: [
          WebViewWidget(
            controller: _controller,
            gestureRecognizers:
                Set()..add(
                  Factory<DragGestureRecognizer>(
                    () => VerticalDragGestureRecognizer(),
                  ),
                ),
          ),
          if (_isLoading) const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
