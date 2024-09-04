import sys
import os
import json
import matrixFactorization as mf
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


# # Create Relations dictionary
R_dict = {}
for user in users_list:
    user_dict = {}
    for job in jobs_list:
        if job['_id'] in user['jobInteractions']:
            user_dict[job['_id']] = 1
        else:
            user_dict[job['_id']] = 0
    R_dict[user['_id']] = user_dict

# Map each userId to its corresponding index
user_mapping = {user: index for index, user in enumerate(R_dict.keys())}

# Map each jobId to its corresponding index
job_mapping = {job: index for index, job in enumerate(next(iter(R_dict.values())).keys())}

# Create the array based on the mapped indexes
R = [[R_dict[user][job] for job in job_mapping] for user in user_mapping]

flipped_job_mapping = {value: key for key, value in job_mapping.items()}

mf = mf.MF(R=R) # number of latent features K

# Train the global model
mf.train()

np.savetxt("array.txt", np.dot(mf.U,mf.V.T))
# exit()

# Get the suggested jobs for each user
userJobSuggestions = {}

for user in users_list[:42]:
    # Get id and network from user's data
    user_id = user['_id']
    user_network = user['network']
    job_interactions = user['jobInteractions']

    # Make prediction
    jobSuggestions = mf.predict(user_id, user_network, itemInteractions = job_interactions, userMappings = user_mapping, itemMapping = job_mapping, flippedItemMapping = flipped_job_mapping)
    # Assign suggested jobs to user
    userJobSuggestions[user_id] = jobSuggestions


# Stringify to JSON format and return to nodejs server
# print(json.dumps(userJobSuggestions, separators=(',',':')))
print("starting to print")
for u,js in userJobSuggestions.items():
    print(u,js)
    sys.stdout.flush()