from flask import Blueprint, request, jsonify, session
import random

def create_admin_blueprint(db, User):
    admin_bp = Blueprint("admin", __name__)

    def check_admin():
        """Helper function to check if user is admin"""
        if "user_id" not in session:
            return False
        user_id = session["user_id"]
        user = User.query.get(user_id)
        if not user:
            return False
        # For now, assume all users can access admin features
        # In real implementation, check user.is_admin or similar
        return True

    @admin_bp.route("/users", methods=["GET"])
    def get_users():
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            # محاكاة قائمة المستخدمين
            users = [
                {
                    "id": "1",
                    "username": "user1",
                    "display_name": "مستخدم واحد",
                    "last_active": "2024-01-01T10:00:00Z",
                    "status": "active"
                },
                {
                    "id": "2", 
                    "username": "user2",
                    "display_name": "مستخدم اثنان",
                    "last_active": "2024-01-01T11:00:00Z",
                    "status": "active"
                }
            ]
            
            return jsonify({"users": users}), 200

        except Exception as e:
            return jsonify({"error": f"Failed to get users: {str(e)}"}), 500

    @admin_bp.route("/users/<user_id>/ban", methods=["POST"])
    def ban_user(user_id):
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            data = request.get_json()
            reason = data.get("reason", "No reason provided") if data else "No reason provided"

            # محاكاة حظر المستخدم
            return jsonify({
                "message": f"User {user_id} banned successfully",
                "reason": reason
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to ban user: {str(e)}"}), 500

    @admin_bp.route("/users/<user_id>/unban", methods=["POST"])
    def unban_user(user_id):
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            # محاكاة إلغاء حظر المستخدم
            return jsonify({
                "message": f"User {user_id} unbanned successfully"
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to unban user: {str(e)}"}), 500

    @admin_bp.route("/reports", methods=["GET"])
    def get_reports():
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            # محاكاة قائمة التقارير
            reports = [
                {
                    "id": "1",
                    "reporter_id": "user1",
                    "reported_user_id": "user2",
                    "reason": "سلوك غير مناسب",
                    "status": "pending",
                    "created_at": "2024-01-01T10:00:00Z"
                },
                {
                    "id": "2",
                    "reporter_id": "user3", 
                    "reported_user_id": "user4",
                    "reason": "محتوى غير مناسب",
                    "status": "resolved",
                    "created_at": "2024-01-01T09:00:00Z"
                }
            ]
            
            return jsonify({"reports": reports}), 200

        except Exception as e:
            return jsonify({"error": f"Failed to get reports: {str(e)}"}), 500

    @admin_bp.route("/reports/<report_id>/review", methods=["POST"])
    def review_report(report_id):
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            data = request.get_json()
            if not data:
                return jsonify({"error": "Review data is required"}), 400

            action = data.get("action")
            notes = data.get("notes", "")
            ban_user = data.get("ban_user", False)

            # محاكاة مراجعة التقرير
            return jsonify({
                "message": f"Report {report_id} reviewed successfully",
                "action": action,
                "notes": notes,
                "user_banned": ban_user
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to review report: {str(e)}"}), 500

    @admin_bp.route("/system-settings", methods=["GET"])
    def get_system_settings():
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            # محاكاة إعدادات النظام
            settings = {
                "max_chat_duration": 3600,
                "auto_disconnect_timeout": 1800,
                "maintenance_mode": False,
                "registration_enabled": True,
                "guest_access_enabled": True
            }
            
            return jsonify({"settings": settings}), 200

        except Exception as e:
            return jsonify({"error": f"Failed to get system settings: {str(e)}"}), 500

    @admin_bp.route("/system-settings", methods=["PUT"])
    def update_system_settings():
        try:
            if not check_admin():
                return jsonify({"error": "Admin access required"}), 403

            data = request.get_json()
            if not data:
                return jsonify({"error": "Settings data is required"}), 400

            # محاكاة تحديث إعدادات النظام
            return jsonify({
                "message": "System settings updated successfully",
                "settings": data
            }), 200

        except Exception as e:
            return jsonify({"error": f"Failed to update system settings: {str(e)}"}), 500

    return admin_bp