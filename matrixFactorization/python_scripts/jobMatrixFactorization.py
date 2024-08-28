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
R = {
    "user1": {"job1": 1, "job2": 0, "job3": 0, "job4": 1, "job5": 1},
    "user2": {"job1": 0, "job2": 0, "job3": 1, "job4": 1, "job5": 0},
    "user3": {"job1": 0, "job2": 1, "job3": 0, "job4": 1, "job5": 1},
    "user4": {"job1": 1, "job2": 1, "job3": 1, "job4": 1, "job5": 0}
}
print(R)

# # Create Relations array
# for user in users_list:
#     user_dict = {}
#     for job in jobs_list:
#         if job['_id'] in user['jobInteractions']:
#             user_dict[job['_id']] = 1
#         else:
#             user_dict[job['_id']] = 0
#     R[user['_id']] = user_dict
    
# Create R with connected users only then pass it


mf = mf.MF(R=R, K=10)

mf.train()