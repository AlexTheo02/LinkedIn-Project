import sys
import json
import matrixFactorization as mf
import generalFunctions as gf

if len(sys.argv) != 2:
    print("Error: arguments not provided correctly")
    exit(0)

# Parse json strings containing user and job data
users_list = json.loads(sys.argv[1])
jobs_list = json.loads(sys.argv[2])

# ------------------------------------------ DUMMY DATA
# users_list = [
#     {"_id": "user1", "connectedUsers": ["user2", "user4", "user6"], "jobInteractions": ["job1", "job4", "job5"]},
#     {"_id": "user2", "connectedUsers": ["user1", "user3"], "jobInteractions": ["job3", "job4"]},
#     {"_id": "user3", "connectedUsers": ["user2", "user5", "user6"], "jobInteractions": ["job2", "job4", "job5"]},
#     {"_id": "user4", "connectedUsers": ["user1", "user5"], "jobInteractions": ["job1", "job2", "job3"]},
#     {"_id": "user5", "connectedUsers": ["user3", "user4"], "jobInteractions": ["job2", "job5"]},
#     {"_id": "user6", "connectedUsers": ["user1", "user3"], "jobInteractions": ["job1", "job3"]}
# ]

# jobs_list = [{"_id": "job1"}, {"_id": "job2"}, {"_id": "job3"}, {"_id": "job4"}, {"_id": "job5"}]

# Relations array
# R_dict = {
#     "user1": {"job1": 1, "job2": 0, "job3": 0, "job4": 1, "job5": 1},
#     "user2": {"job1": 0, "job2": 0, "job3": 1, "job4": 1, "job5": 0},
#     "user3": {"job1": 0, "job2": 1, "job3": 0, "job4": 1, "job5": 1},
#     "user4": {"job1": 1, "job2": 1, "job3": 1, "job4": 1, "job5": 0}
# }
# print(R_dict)

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

mf = mf.MF(R=R, K=5)

# Train the global model
mf.train()

# Get the suggested jobs for each user
userJobSuggestions = {}

for user in users_list:
    # Get id and network from user's data
    user_id = user['_id']
    user_network = user['connectedUsers']
    job_interactions = user['jobInteractions']

    # Make prediction
    jobSuggestions = mf.predict(user_id, user_network, job_interactions, user_mapping, itemMapping = job_mapping, flippedItemMapping = flipped_job_mapping)
    # Assign suggested jobs to user
    userJobSuggestions[user_id] = jobSuggestions


# Stringify to JSON format and return to nodejs server
print(json.dumps(userJobSuggestions, separators=(',',':')))
sys.stdout.flush()
