"use client";

import React, { useState } from "react";
import { Bike, Store, Home, Navigation, ZoomIn, ZoomOut } from "lucide-react";
import { calculateDistanceKm, estimateDeliveryMinutes } from "@/lib/utils";

interface InteractiveDeliveryMapProps {
  restaurantCoords: { lat: number; lng: number; name?: string };
  clientCoords: { lat: number; lng: number; address?: string };
  courierCoords?: { lat: number; lng: number; name?: string } | null;
  status?: string;
  interactive?: boolean;
}

export function InteractiveDeliveryMap({
  restaurantCoords,
  clientCoords,
  courierCoords,
  status = "en_livraison",
}: InteractiveDeliveryMapProps) {
  const [zoom, setZoom] = useState(1);

  // Position par défaut du livreur entre resto et client si non fourni
  const courierLat =
    courierCoords?.lat ?? (restaurantCoords.lat + clientCoords.lat) / 2;
  const courierLng =
    courierCoords?.lng ?? (restaurantCoords.lng + clientCoords.lng) / 2;

  // Calcul des distances
  const distanceKm = calculateDistanceKm(
    restaurantCoords.lat,
    restaurantCoords.lng,
    clientCoords.lat,
    clientCoords.lng
  );
  const etaMinutes = estimateDeliveryMinutes(distanceKm);

  // Coordonnées relatives normalisées sur le canvas SVG (viewBox 0 0 600 360)
  const restoPos = { x: 140, y: 240 };
  const clientPos = { x: 480, y: 100 };
  const courierProgress =
    status === "en_route_restaurant"
      ? 0.15
      : status === "recuperee"
      ? 0.3
      : status === "en_route_client" || status === "en_livraison"
      ? 0.65
      : status === "livree"
      ? 1
      : 0.5;

  const currentCourierPos = {
    x: restoPos.x + (clientPos.x - restoPos.x) * courierProgress,
    y: restoPos.y + (clientPos.y - restoPos.y) * courierProgress,
  };

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm group select-none">
      {/* Texture de fond de carte urbaine stylisée Light Mode */}
      <svg
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
        viewBox="0 0 600 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grille urbaine & routes */}
        <rect width="600" height="360" fill="#f8fafc" />
        <path
          d="M-20 60 H620 M-20 180 H620 M-20 300 H620 M100 -20 V380 M300 -20 V380 M500 -20 V380"
          stroke="#e2e8f0"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Parcs stylisés (vert tendre) */}
        <path
          d="M-50 320 C100 280, 200 340, 350 290 C500 240, 580 310, 650 270 L650 380 L-50 380 Z"
          fill="#dcfce7"
          opacity="0.8"
        />

        {/* Cours d'eau (Lac Kipopo & Rivière Kafubu stylisés bleu ciel) */}
        <path
          d="M-50 80 C150 140, 250 40, 420 120 C540 180, 590 100, 650 140"
          stroke="#bae6fd"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M-50 80 C150 140, 250 40, 420 120 C540 180, 590 100, 650 140"
          stroke="#7dd3fc"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Rues et boulevards principaux */}
        <path
          d="M60 320 L240 200 L440 220 L560 60"
          stroke="#cbd5e1"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 320 L240 200 L440 220 L560 60"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Rues secondaires */}
        <path
          d="M120 40 L180 180 L280 260"
          stroke="#cbd5e1"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M120 40 L180 180 L280 260"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <path
          d="M380 340 L360 220 L480 140"
          stroke="#cbd5e1"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M380 340 L360 220 L480 140"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Tracé de livraison en surbrillance (Gradient ambre -> émeraude) */}
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Chemin direct en pointillé animé */}
        <path
          d={`M${restoPos.x} ${restoPos.y} Q 300 240, ${clientPos.x} ${clientPos.y}`}
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeDasharray="6 6"
          className="animate-pulse"
        />

        {/* Marker Restaurant */}
        <g transform={`translate(${restoPos.x}, ${restoPos.y})`}>
          <circle r="18" fill="#f59e0b" opacity="0.2" className="animate-ping" />
          <circle r="12" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <circle r="5" fill="#ffffff" />
        </g>

        {/* Marker Client */}
        <g transform={`translate(${clientPos.x}, ${clientPos.y})`}>
          <circle r="18" fill="#10b981" opacity="0.2" className="animate-ping" />
          <circle r="12" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <circle r="5" fill="#ffffff" />
        </g>

        {/* Marker Livreur en temps réel (Halo animé pulsant) */}
        <g transform={`translate(${currentCourierPos.x}, ${currentCourierPos.y})`}>
          <circle r="26" fill="url(#pulseGlow)" className="animate-ping" />
          <circle r="16" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
          <circle r="6" fill="#ffffff" />
        </g>
      </svg>

      {/* Cartouche d'informations Live HUD en surimpression */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 shadow-sm text-xs flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-900">GPS Live Tracking</span>
        </div>
        <div className="h-3.5 w-px bg-slate-200" />
        <div className="text-slate-600">
          Distance : <span className="text-slate-900 font-semibold">{distanceKm} km</span>
        </div>
        <div className="h-3.5 w-px bg-slate-200" />
        <div className="text-slate-600">
          ETA : <span className="text-emerald-700 font-bold">{etaMinutes} min</span>
        </div>
      </div>

      {/* Badges sur les points de livraison */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none transition-all"
        style={{ left: `${(restoPos.x / 600) * 100}%`, top: `${(restoPos.y / 360) * 100}%` }}
      >
        <div className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 whitespace-nowrap">
          <Store className="w-3 h-3" />
          {restaurantCoords.name || "Restaurant"}
        </div>
      </div>

      <div
        className="absolute transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none transition-all"
        style={{
          left: `${(currentCourierPos.x / 600) * 100}%`,
          top: `${(currentCourierPos.y / 360) * 100}%`,
        }}
      >
        <div className="bg-sky-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap animate-bounce">
          <Bike className="w-3 h-3" />
          Livreur en route
        </div>
      </div>

      <div
        className="absolute transform -translate-x-1/2 -translate-y-full mb-3 pointer-events-none transition-all"
        style={{ left: `${(clientPos.x / 600) * 100}%`, top: `${(clientPos.y / 360) * 100}%` }}
      >
        <div className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 whitespace-nowrap">
          <Home className="w-3 h-3" />
          Adresse de livraison
        </div>
      </div>

      {/* Contrôles interactifs */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
          className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 shadow-xs backdrop-blur transition-colors cursor-pointer"
          title="Zoom avant"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
          className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 shadow-xs backdrop-blur transition-colors cursor-pointer"
          title="Zoom arrière"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[11px] text-slate-600 bg-white/90 px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
        <Navigation className="w-3 h-3 text-sky-600" />
        <span>Position GPS Lubumbashi : {courierLat.toFixed(4)}, {courierLng.toFixed(4)}</span>
      </div>
    </div>
  );
}
