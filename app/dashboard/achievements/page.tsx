"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  Trophy,
  Medal,
  Star,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

// Achievement type matching the database structure
interface Achievement {
  id: string;
  playerId: string;
  tournamentName: string;
  category: string;
  position: "gold" | "silver" | "bronze" | "participation";
  year: number;
  date: string;
  certificateUrl?: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlayerProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  beltCategory: string;
  dojoId: string;
  city: string;
  country: string;
  weight?: number;
  height?: number;
  profileImage?: string;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    tournamentName: "",
    category: "",
    position: "participation" as "gold" | "silver" | "bronze" | "participation",
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/auth/login");
        return;
      }
      const data = await res.json();
      setUser(data.user);
      await loadPlayerProfile();
    } catch (error) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerProfile = async () => {
    try {
      // Fetch all players and find the one belonging to current user
      const res = await fetch("/api/players");
      if (res.ok) {
        const data = await res.json();
        const profile = data.players.find(
          (p: PlayerProfile) => p.userId === user?.id
        );
        if (profile) {
          setPlayerProfile(profile);
          // Only show approved achievements to the user
          const approvedAchievements = (profile.achievements || []).filter(
            (a: Achievement) => a.isApproved
          );
          setAchievements(approvedAchievements);
        }
      }
    } catch (error) {
      console.error("Failed to load player profile:", error);
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.tournamentName || !newAchievement.category) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    if (!playerProfile) {
      showToast("Please create a player profile first", "error");
      router.push("/dashboard/create-profile");
      return;
    }

    try {
      // Add achievement to the player profile via API
      const achievementData = {
        playerId: playerProfile.id,
        tournamentName: newAchievement.tournamentName,
        category: newAchievement.category,
        position: newAchievement.position,
        year: parseInt(newAchievement.year),
        date: newAchievement.date,
        isApproved: false, // New achievements need admin approval
      };

      // Get current achievements and add the new one
      const updatedAchievements = [...achievements, {
        ...achievementData,
        id: `temp-${Date.now()}`,
        playerId: playerProfile.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];

      // Update the player profile
      const res = await fetch("/api/players", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: playerProfile.id,
          achievements: updatedAchievements,
        }),
      });

      if (res.ok) {
        showToast("Achievement submitted for approval!", "success");
        setShowAddModal(false);
        setNewAchievement({
          tournamentName: "",
          category: "",
          position: "participation",
          year: new Date().getFullYear().toString(),
          date: new Date().toISOString().split("T")[0],
        });
        // Note: We don't update local state here because the achievement needs approval
        // It will appear after admin approves it
      } else {
        showToast("Failed to add achievement", "error");
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
      showToast("Failed to add achievement", "error");
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "gold":
        return (
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        );
      case "silver":
        return (
          <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
            <Medal className="w-6 h-6 text-white" />
          </div>
        );
      case "bronze":
        return (
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFEFE] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate stats
  const goldCount = achievements.filter((a) => a.position === "gold").length;
  const silverCount = achievements.filter((a) => a.position === "silver").length;
  const bronzeCount = achievements.filter((a) => a.position === "bronze").length;
  const participationCount = achievements.filter((a) => a.position === "participation").length;

  return (
    <div className="min-h-screen bg-[#FEFEFE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Achievements
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your tournament accomplishments
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              <Trophy className="w-5 h-5" />
              <span>Add Achievement</span>
            </button>
          </div>
        </div>

        {!playerProfile && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">No Player Profile</p>
              <p className="text-yellow-700 text-sm mt-1">
                You need to create a player profile before adding achievements.
              </p>
              <button
                onClick={() => router.push("/dashboard/create-profile")}
                className="mt-2 text-sm font-semibold text-yellow-800 underline hover:no-underline"
              >
                Create Player Profile
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Achievement Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">
                {goldCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Gold</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-600">
                {silverCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Silver</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {bronzeCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Bronze</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {participationCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Participation</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total Achievements: <span className="font-bold text-gray-900">{achievements.length}</span>
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        {achievements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Achievements Yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your legacy by adding your first tournament achievement!
            </p>
            {playerProfile && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
              >
                <Trophy className="w-5 h-5" />
                <span>Add Your First Achievement</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-lg shadow-md p-6 border-2 border-yellow-400 hover:shadow-xl transition"
              >
                <div className="flex items-start space-x-4">
                  {getPositionIcon(achievement.position)}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {achievement.tournamentName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {achievement.category}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full font-semibold capitalize ${
                        achievement.position === "gold"
                          ? "bg-yellow-100 text-yellow-800"
                          : achievement.position === "silver"
                          ? "bg-gray-100 text-gray-800"
                          : achievement.position === "bronze"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {achievement.position}
                      </span>
                      <span>•</span>
                      <span>{achievement.year}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(achievement.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Achievement Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Achievement
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Submit a tournament achievement for admin approval.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    value={newAchievement.tournamentName}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        tournamentName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., National Karate Championship 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newAchievement.category}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Kata - Senior Men"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <select
                    value={newAchievement.position}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        position: e.target.value as "gold" | "silver" | "bronze" | "participation",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="gold">🥇 Gold (1st Place)</option>
                    <option value="silver">🥈 Silver (2nd Place)</option>
                    <option value="bronze">🥉 Bronze (3rd Place)</option>
                    <option value="participation">Participation</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={newAchievement.year}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          year: e.target.value,
                        })
                      }
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newAchievement.date}
                      onChange={(e) =>
                        setNewAchievement({
                          ...newAchievement,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAchievement({
                      tournamentName: "",
                      category: "",
                      position: "participation",
                      year: new Date().getFullYear().toString(),
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAchievement}
                  className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}