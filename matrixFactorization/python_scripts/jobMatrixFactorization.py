import sys
import os
import json
import matrixFactorization
import binaryMatrixFactorization
import numpy as np
# users_path = os.getenv("USERS_PATH")
# jobs_path = os.getenv("ITEMS_PATH")
users_path = "../Data/users.json"
jobs_path = "../Data/items.json"

# Open the json files and read data
with open(users_path, 'r') as users_file:
    users_list = json.load(users_file)

with open(jobs_path, 'r') as jobs_file:
    jobs_list = json.load(jobs_file)

n_users = len(users_list)
n_jobs = len(jobs_list)

R = [0 for _ in range(n_users)]
job_to_index = {}
index_to_job = {}

user_to_index = {}
index_to_user = {}

# Create relationships array
for i,user in enumerate(users_list):
    user_job_interactions = [0 for _ in range(n_jobs)]
    
    # Update user dictionaries
    user_to_index[user['_id']] = i
    index_to_user[i] = user['_id']

    for j,job in enumerate(jobs_list):
        user_job_interactions[j] = 1 if job['_id'] in user['jobInteractions'] else 0
        
        # Update job dictionaries
        job_to_index[job['_id']] = j
        index_to_job[j] = job['_id']

    R[i] = user_job_interactions


A = [0 for _ in range(n_users)]
for i, user in enumerate(users_list):
    user_adjacency = [0 for _ in range(n_users)]

    for j, connected_user in enumerate(users_list):
        user_adjacency[j] = 1 if connected_user['_id'] in user['network'] else 0
    
    # Update user's adjacency
    A[i] = user_adjacency

# mf = matrixFactorization.MF(R=R, K=25, lr=0.01, n_iter = 1000)
bmf = binaryMatrixFactorization.BMF(R, A, K=10, lr=0.01, reg_param=0.01, epochs=1000)

# mf.train()
bmf.train()

# job_suggestions = mf.get_suggestions(users_list[5], user_to_index, index_to_job)
# print(job_suggestions)

selected_user = 5

recommended_job_indices = bmf.recommend(user_id=selected_user, top_n=10)
recommended_jobs = []
for job_index in recommended_job_indices:
    recommended_jobs.append(index_to_job[job_index])

print(f"Recommended jobs for user {index_to_user[selected_user]}: {recommended_jobs}")

















# # Create Relations dictionary
# R_dict = {}
# for user in users_list:
#     user_dict = {}
#     for job in jobs_list:
#         if job['_id'] in user['jobInteractions']:
#             user_dict[job['_id']] = 1
#         else:
#             user_dict[job['_id']] = 0
#     R_dict[user['_id']] = user_dict

# # Map each userId to its corresponding index
# user_mapping = {user: index for index, user in enumerate(R_dict.keys())}

# # Map each jobId to its corresponding index
# job_mapping = {job: index for index, job in enumerate(next(iter(R_dict.values())).keys())}

# # Create the array based on the mapped indexes
# R = [[R_dict[user][job] for job in job_mapping] for user in user_mapping]

# flipped_job_mapping = {value: key for key, value in job_mapping.items()}

# mf = mf.MF(R=R) # number of latent features K

# # Train the global model
# mf.train()

# np.savetxt("array.txt", np.dot(mf.U,mf.V.T))
# # exit()

# # Get the suggested jobs for each user
# userJobSuggestions = {}

# for user in users_list[:42]:
#     # Get id and network from user's data
#     user_id = user['_id']
#     user_network = user['network']
#     job_interactions = user['jobInteractions']

#     # Make prediction
#     jobSuggestions = mf.predict(user_id, user_network, itemInteractions = job_interactions, userMappings = user_mapping, itemMapping = job_mapping, flippedItemMapping = flipped_job_mapping)
#     # Assign suggested jobs to user
#     userJobSuggestions[user_id] = jobSuggestions


# # Stringify to JSON format and return to nodejs server
# # print(json.dumps(userJobSuggestions, separators=(',',':')))
# print("starting to print")
# for u,js in userJobSuggestions.items():
#     print(u,js)
#     sys.stdout.flush()