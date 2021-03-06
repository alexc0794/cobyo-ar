import { useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../config";
import { fetchCurrentlyPlaying } from "./services/currentlyPlayingService";
import { fetchRecentlyPlayed } from "./services/recentlyPlayedService";

function Track({ isMarkerFound }) {
  useEffect(() => {
    async function fetchTrack() {
      let track;
      try {
        track = await fetchCurrentlyPlaying();
      } catch {
        try {
          track = await fetchRecentlyPlayed();
        } catch (error) {
          return {
            imageTitle: error,
          };
        }
      }
      return {
        imageUrl: track.album.images[0].url,
        imageTitle: `${track.name} by ${track.artists[0].name}`,
        trackUrl: track.external_urls.spotify,
      };
    }

    let pressTimeout;

    async function loadTrack() {
      const primaryImageElement = document.getElementById("primary-image");
      const primaryTextElement = document.getElementById("primary-text");
      const { imageTitle, imageUrl, trackUrl } = await fetchTrack();
      if (imageUrl) {
        primaryImageElement.setAttribute("src", imageUrl);
      }
      if (imageTitle) {
        primaryTextElement.setAttribute("text", `value: ${imageTitle}`);
      }
      if (trackUrl) {
        primaryImageElement.addEventListener("mousedown", () => {
          pressTimeout = setTimeout(
            () => (window.location.href = trackUrl),
            2000
          );
        });
        primaryImageElement.addEventListener("mouseup", () =>
          clearTimeout(pressTimeout)
        );
      }
    }

    let startX = 0;
    let distance = 0;
    const SWIPE_DISTANCE_THRESHOLD = window.innerWidth - 100;

    function handleTouchStart(e) {
      const touch = e.changedTouches[0];
      startX = parseInt(touch.clientX);
      e.preventDefault();
    }

    function handleTouchMove(e) {
      const touch = e.changedTouches[0];
      distance = parseInt(touch.clientX) - startX;
      const primaryImageElement = document.getElementById("primary-image");
      primaryImageElement.setAttribute(
        "opacity",
        (SWIPE_DISTANCE_THRESHOLD - Math.abs(distance)) /
          SWIPE_DISTANCE_THRESHOLD
      );
      e.preventDefault();
    }

    async function handleTouchEnd(e) {
      if (distance < -1 * SWIPE_DISTANCE_THRESHOLD) {
        // Swipe right is negative
        try {
          await axios.get(`${BASE_API_URL}/next`);
          const primaryImageElement = document.getElementById("primary-image");
          primaryImageElement.setAttribute("animation", "loop", true);
          primaryImageElement.emit("rotate");
          setTimeout(async () => {
            await loadTrack();
            primaryImageElement.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            primaryImageElement.setAttribute("animation", "loop", false);
          }, 2500);
        } catch (e) {
          console.warn(e);
        }
      }
      const primaryImageElement = document.getElementById("primary-image");
      primaryImageElement.setAttribute("opacity", 1);
      startX = 0;
      distance = 0;
      e.preventDefault();
    }

    const scene = document.getElementById("scene");
    if (isMarkerFound) {
      loadTrack();
      scene.addEventListener("touchstart", handleTouchStart);
      scene.addEventListener("touchmove", handleTouchMove);
      scene.addEventListener("touchend", handleTouchEnd);
    } else {
      scene.removeEventListener("touchstart", handleTouchStart);
      scene.removeEventListener("touchmove", handleTouchMove);
      scene.removeEventListener("touchend", handleTouchEnd);
    }
  }, [isMarkerFound]);

  return null;
}

export default Track;
