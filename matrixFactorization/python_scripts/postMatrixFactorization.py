import sys
import os
import json
import matrixFactorization
import numpy as np
from dotenv import load_dotenv
load_dotenv()

users_path = os.getenv("USERS_PATH")
posts_path = os.getenv("POSTS_PATH")
post_recommendations_path = os.getenv("POSTS_REC_PATH")
trained_model_filename = os.getenv("TRAINED_POSTS_MF_MODEL")

# Open the json files and read data
with open(users_path, 'r') as users_file:
    users_list = json.load(users_file)

with open(posts_path, 'r') as posts_file:
    posts_list = json.load(posts_file)

n_users = len(users_list)
n_posts = len(posts_list)

R = [0 for _ in range(n_users)]
post_to_index = {}
index_to_post = {}

user_to_index = {}
index_to_user = {}

# Create relationships array
for i,user in enumerate(users_list):
    user_post_interactions = [0 for _ in range(n_posts)]
    
    # Update user dictionaries
    user_to_index[user['_id']] = i
    index_to_user[i] = user
    user_comment_ids = user['publishedComments']

    for j,post in enumerate(posts_list):
        # If user has liked/commented on any post
        if user['interactionSource']:
            # Count how many comments user has published to this specific post
            post_comment_ids = post['commentsList']
            n_comments = sum(1 for comment_id in user_comment_ids if comment_id in post_comment_ids)
            
            liked = 1.5 if post['_id'] in user['likedPosts'] else 0
            comments_value = 2 * n_comments
            interaction_value = liked + comments_value
            user_post_interactions[j] = interaction_value
        else:
            user_post_interactions[j] = 1 if post['_id'] in user['postInteractions'] else 0
        
        # Update post dictionaries
        post_to_index[post['_id']] = j
        index_to_post[j] = post

    R[i] = user_post_interactions

# Modify R to include network influence
R_net = [row[:] for row in R]
net_param = 0.3
visited_users = []

for i in range(len(R)):
    u1 = index_to_user[i]
    for j in range(len(R)):
        # Skip self
        if i == j:
            continue
        u2 = index_to_user[j]
        # Users are connected
        if (u2['_id'] in u1['network'] and u2['_id'] not in visited_users):
            # For each post, update values on connected users
            for k in range(len(R[j])):
                R_net[i][k] += net_param * R[j][k]
                R_net[j][k] += net_param * R[i][k]
    visited_users.append(u1["_id"])

# ----------------------------------------------------------------------------------------------- Matrix Factorization
mf = matrixFactorization.MF(R=R_net, K=60, lr=0.001, n_iter = 1000, tol=1e-4, reg_param=0.00001)
mf.train(no_output=True) # train with no output messages
mf.save(trained_model_filename)

# mf = mf.load(trained_model_filename)

# ----------------------------------------------------------------------------------------------- Upload to files and notify server

# Send response to a file
top_n = 40
post_recommendations = {}
for i,user in enumerate(users_list):
    # Get recommended post indices
    # print(f"Getting recommendations for user {i + 1} of {len(users_list)}")
    post_indices = mf.recommend(user_to_index[user['_id']], top_n=top_n)

    # Transform them into post ids
    recommended_post_ids = []
    for post_index in post_indices:
        post_id = index_to_post[post_index]['_id']
        recommended_post_ids.append(post_id)
    post_recommendations[user['_id']] = recommended_post_ids

# print(f"Writing recommendations to {post_recommendations_path}")
# Write post_recommendations into output file and notify server (with print msg) to read
with open(post_recommendations_path, 'w') as json_file:
    json.dump(post_recommendations, json_file, indent=2)

sys.stdout.flush()
print("MF DONE")
sys.stdout.flush()