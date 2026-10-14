import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";
import {
  Hotel,
  MeetingRoom,
  BookOnline,
  ExitToApp,
  People,
  AttachMoney,
  TrendingUp,
} from "@mui/icons-material";

const TableauDeBord = () => {
  const [stats, setStats] = useState({
    totalChambres: 0,
    chambresDisponibles: 0,
    reservationsActuelles: 0,
    departsAujourdhui: 0,
    totalUtilisateurs: 0,
    revenuMensuel: 0,
    tauxOccupation: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Remplacer avec vos endpoints API réels
        const [chambres, reservations, utilisateurs] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/chambres"),
          axios.get("http://localhost:3000/api/v1/reservations"),
          axios.get("http://localhost:3000/api/v1/utilisateurs"),
        ]);

        const today = new Date().toISOString().split("T")[0];

        setStats({
          totalChambres: chambres.data.length,
          chambresDisponibles: chambres.data.filter(
            (c) => c.status === "disponible"
          ).length,
          reservationsActuelles: reservations.data.filter(
            (r) => r.Etat === "EN_COURS"
          ).length,
          departsAujourdhui: reservations.data.filter(
            (r) => r.date_fin === today
          ).length,
          totalUtilisateurs: utilisateurs.data.length,
          revenuMensuel: 150000, // À remplacer par la vraie donnée
          tauxOccupation: 75, // À remplacer par la vraie donnée
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, subtitle, Icon }) => (
    <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {Icon && (
          <Icon className="text-[#C4A998]" style={{ fontSize: "24px" }} />
        )}
      </div>
      <p className="text-3xl font-bold text-[#C4A998]">{value}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tableau de bord de l'administrateur
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Chambres"
            value={stats.totalChambres}
            subtitle="Chambres enregistrées"
            Icon={Hotel}
          />
          <StatCard
            title="Chambres Disponibles"
            value={stats.chambresDisponibles}
            subtitle="Prêtes pour réservation"
            Icon={MeetingRoom}
          />
          <StatCard
            title="Réservations"
            value={stats.reservationsActuelles}
            subtitle="Réservations en cours"
            Icon={BookOnline}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between items-center">
              Statistiques rapides
              <TrendingUp className="text-[#C4A998]" />
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux d'occupation</span>
                <span className="text-[#C4A998] font-semibold">
                  {stats.tauxOccupation}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Départs aujourd'hui</span>
                <span className="text-[#C4A998] font-semibold">
                  {stats.departsAujourdhui}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total utilisateurs</span>
                <span className="text-[#C4A998] font-semibold">
                  {stats.totalUtilisateurs}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f1e8] p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex justify-between items-center">
              Performance financière
              <AttachMoney className="text-[#C4A998]" />
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenu mensuel</span>
                <span className="text-[#C4A998] font-semibold">
                  {stats.revenuMensuel.toLocaleString("fr-DZ")} DA
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de remplissage</span>
                <span className="text-[#C4A998] font-semibold">
                  {Math.round(
                    (stats.reservationsActuelles / stats.totalChambres) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableauDeBord;
