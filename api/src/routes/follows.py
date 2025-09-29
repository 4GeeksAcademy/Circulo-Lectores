from flask import request, jsonify
from src.db import db
from src.models.models import Follows, Profiles
from sqlalchemy import select, and_, func
from flask_jwt_extended import jwt_required, get_jwt_identity


def follows_routes(app):
    @app.route("/profiles/search", methods=["GET"])
    @jwt_required()
    def search_profiles():
        query = request.args.get("q", "")
        if not query:
            return jsonify({"error": "Missing search query"}), 400

        current_user_id = int(get_jwt_identity())

        profiles = (
            db.session.execute(
                select(Profiles).where(Profiles.name.ilike(f"%{query}%"))
            )
            .scalars()
            .all()
        )

        results = []
        for profile in profiles:
            if profile.id != current_user_id:
                is_following = db.session.execute(
                    select(Follows).where(
                        and_(
                            Follows.follower_id == current_user_id,
                            Follows.following_id == profile.id,
                        )
                    )
                ).scalar_one_or_none()

                followers_count = db.session.execute(
                    select(func.count())
                    .select_from(Follows)
                    .where(Follows.following_id == profile.id)
                ).scalar()

                followings_count = db.session.execute(
                    select(func.count())
                    .select_from(Follows)
                    .where(Follows.follower_id == profile.id)
                ).scalar()

                results.append(
                    {
                        "id": profile.id,
                        "name": profile.name,
                        "avatar": profile.avatar,
                        "followers_count": followers_count,
                        "followings_count": followings_count,
                        "is_following": is_following is not None,
                    }
                )

        return jsonify(results), 200

    @app.route("/follows/<int:user_id>", methods=["POST"])
    @jwt_required()
    def follow_user(user_id):
        current_user_id = int(get_jwt_identity())

        if current_user_id == user_id:
            return jsonify({"error": "Cannot follow yourself"}), 400

        user_to_follow = db.session.get(Profiles, user_id)
        if not user_to_follow:
            return jsonify({"error": "User not found"}), 404

        existing_follow = db.session.execute(
            select(Follows).where(
                and_(
                    Follows.follower_id == current_user_id,
                    Follows.following_id == user_id,
                )
            )
        ).scalar_one_or_none()

        if existing_follow:
            return jsonify({"error": "Already following this user"}), 400

        new_follow = Follows(follower_id=current_user_id, following_id=user_id)
        db.session.add(new_follow)
        db.session.commit()

        return jsonify({"message": "User followed successfully"}), 201

    @app.route("/follows/<int:user_id>", methods=["DELETE"])
    @jwt_required()
    def unfollow_user(user_id):
        current_user_id = int(get_jwt_identity())

        existing_follow = db.session.execute(
            select(Follows).where(
                and_(
                    Follows.follower_id == current_user_id,
                    Follows.following_id == user_id,
                )
            )
        ).scalar_one_or_none()

        if not existing_follow:
            return jsonify({"error": "Not following this user"}), 404

        db.session.delete(existing_follow)
        db.session.commit()

        return jsonify({"message": "User unfollowed successfully"}), 200

    @app.route("/profiles/<int:user_id>/stats", methods=["GET"])
    @jwt_required()
    def get_user_stats(user_id):
        profile = db.session.get(Profiles, user_id)
        if not profile:
            return jsonify({"error": "User not found"}), 404

        followers_count = db.session.execute(
            select(func.count())
            .select_from(Follows)
            .where(Follows.following_id == user_id)
        ).scalar()

        followings_count = db.session.execute(
            select(func.count())
            .select_from(Follows)
            .where(Follows.follower_id == user_id)
        ).scalar()

        return jsonify(
            {"followers_count": followers_count, "followings_count": followings_count}
        ), 200

    @app.route("/follows/<int:user_id>/followers", methods=["GET"])
    @jwt_required()
    def get_followers(user_id):
        profile = db.session.get(Profiles, user_id)
        if not profile:
            return jsonify({"error": "User not found"}), 404

        follower_ids = (
            db.session.execute(
                select(Follows.follower_id).where(Follows.following_id == user_id)
            )
            .scalars()
            .all()
        )

        followers = []
        for follower_id in follower_ids:
            follower_profile = db.session.get(Profiles, follower_id)
            if follower_profile:
                followers.append(follower_profile.serialize())

        return jsonify(followers), 200

    @app.route("/follows/<int:user_id>/followings", methods=["GET"])
    @jwt_required()
    def get_followings(user_id):
        profile = db.session.get(Profiles, user_id)
        if not profile:
            return jsonify({"error": "User not found"}), 404

        following_ids = (
            db.session.execute(
                select(Follows.following_id).where(Follows.follower_id == user_id)
            )
            .scalars()
            .all()
        )

        followings = []
        for following_id in following_ids:
            following_profile = db.session.get(Profiles, following_id)
            if following_profile:
                followings.append(following_profile.serialize())

        return jsonify(followings), 200
