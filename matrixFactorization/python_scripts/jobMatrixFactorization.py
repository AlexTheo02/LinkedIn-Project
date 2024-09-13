import sys
import os
import json
import matrixFactorization
import numpy as np
from dotenv import load_dotenv
load_dotenv()

users_path = os.getenv("USERS_PATH")
jobs_path = os.getenv("JOBS_PATH")
job_recommendations_path = os.getenv("JOBS_REC_PATH")
trained_model_filename = os.getenv("TRAINED_JOBS_MF_MODEL")

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
    index_to_user[i] = user

    for j,job in enumerate(jobs_list):
        user_job_interactions[j] = 1 if job['_id'] in user['jobInteractions'] else 0
        
        # Update job dictionaries
        job_to_index[job['_id']] = j
        index_to_job[j] = job

    R[i] = user_job_interactions

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
            # For each job, update values on connected users
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
job_recommendations = {}
for i,user in enumerate(users_list):
    # Get recommended job indices
    # print(f"Getting recommendations for user {i + 1} of {len(users_list)}")
    job_indices = mf.recommend(user_to_index[user['_id']], top_n=top_n)

    # Transform them into job ids
    recommended_job_ids = []
    for job_index in job_indices:
        job_id = index_to_job[job_index]['_id']
        recommended_job_ids.append(job_id)
    job_recommendations[user['_id']] = recommended_job_ids

# print(f"Writing recommendations to {job_recommendations_path}")
# Write job_recommendations into output file and notify server (with print msg) to read
with open(job_recommendations_path, 'w') as json_file:
    json.dump(job_recommendations, json_file, indent=2)


sys.stdout.flush()
print("MF DONE")
sys.stdout.flush()