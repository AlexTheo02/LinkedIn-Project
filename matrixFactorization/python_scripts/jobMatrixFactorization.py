import sys
import json
import matrixFactorization as mf

# if len(sys.argv) != 2:
#     print("Error: arguments not provided correctly")
#     exit(0)

# Parse json strings containing user and job data
# users_list = json.loads(sys.argv[1])
# jobs_list = json.loads(sys.argv[2])

# Relations array
R_dict = {
    "user1": {"job1": 1, "job2": 0, "job3": 0, "job4": 1, "job5": 1},
    "user2": {"job1": 0, "job2": 0, "job3": 1, "job4": 1, "job5": 0},
    "user3": {"job1": 0, "job2": 1, "job3": 0, "job4": 1, "job5": 1},
    "user4": {"job1": 1, "job2": 1, "job3": 1, "job4": 1, "job5": 0}
}
print(R_dict)

# # Create Relations array
# for user in users_list:
#     user_dict = {}
#     for job in jobs_list:
#         if job['_id'] in user['jobInteractions']:
#             user_dict[job['_id']] = 1
#         else:
#             user_dict[job['_id']] = 0
#     R_dict[user['_id']] = user_dict

# Map each userId to its corresponding index
user_mapping = {user: index for index, user in enumerate(R_dict.keys())}

# Map each jobId to its corresponding index
job_mapping = {job: index for index, job in enumerate(next(iter(R_dict.values())).keys())}

# Create the array based on the mapped indexes
R = [[R_dict[user][job] for job in job_mapping] for user in user_mapping]

print("ARRAY")
for row in R:
    print(row)

print("User mapping", user_mapping)
print("Job mapping", job_mapping)


mf = mf.MF(R=R_dict, K=2)

# No need to train a different model for each user
mf.train()