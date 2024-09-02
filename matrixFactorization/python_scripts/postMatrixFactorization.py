import sys
import json
import matrixFactorization as mf
import generalFunctions as gf

if len(sys.argv) != 3:
    print("Error: arguments not provided correctly")
    exit(0)

# Parse json strings containing user and post data
users_list = json.loads(sys.argv[1])
posts_list = json.loads(sys.argv[2])

# ------------------------------------------ DUMMY DATA
# users_list = [
#     {"_id": "user1", "connectedUsers": ["user2", "user4", "user6"], "postInteractions": ["post1", "post4", "post5"]},
#     {"_id": "user2", "connectedUsers": ["user1", "user3"], "postInteractions": ["post3", "post4"]},
#     {"_id": "user3", "connectedUsers": ["user2", "user5", "user6"], "postInteractions": ["post2", "post4", "post5"]},
#     {"_id": "user4", "connectedUsers": ["user1", "user5"], "postInteractions": ["post1", "post2", "post3"]},
#     {"_id": "user5", "connectedUsers": ["user3", "user4"], "postInteractions": ["post2", "post5"]},
#     {"_id": "user6", "connectedUsers": ["user1", "user3"], "postInteractions": ["post1", "post3"]}
# ]

# posts_list = [{"_id": "post1"}, {"_id": "post2"}, {"_id": "post3"}, {"_id": "post4"}, {"_id": "post5"}]

# Relations array
# R_dict = {
#     "user1": {"post1": 1, "post2": 0, "post3": 0, "post4": 1, "post5": 1},
#     "user2": {"post1": 0, "post2": 0, "post3": 1, "post4": 1, "post5": 0},
#     "user3": {"post1": 0, "post2": 1, "post3": 0, "post4": 1, "post5": 1},
#     "user4": {"post1": 1, "post2": 1, "post3": 1, "post4": 1, "post5": 0}
# }
# print(R_dict)

# # Create Relations dictionary
R_dict = {}
for user in users_list:
    user_dict = {}
    for post in posts_list:
        if post['_id'] in user['postInteractions']:
            user_dict[post['_id']] = 1
        else:
            user_dict[post['_id']] = 0
    R_dict[user['_id']] = user_dict

# Map each userId to its corresponding index
user_mapping = {user: index for index, user in enumerate(R_dict.keys())}

# Map each postId to its corresponding index
post_mapping = {post: index for index, post in enumerate(next(iter(R_dict.values())).keys())}

# Create the array based on the mapped indexes
R = [[R_dict[user][post] for post in post_mapping] for user in user_mapping]

flipped_post_mapping = {value: key for key, value in post_mapping.items()}

mf = mf.MF(R=R, K=5) # number of latent features K = 5

# Train the global model
mf.train()

# Get the suggested posts for each user
userPostSuggestions = {}

for user in users_list:
    # Get id and network from user's data
    user_id = user['_id']
    user_network = user['network']
    post_interactions = user['postInteractions']

    # Make prediction
    postSuggestions = mf.predict(user_id, user_network, itemInteractions = post_interactions, userMappings = user_mapping, itemMapping = post_mapping, flippedItemMapping = flipped_post_mapping)
    # Assign suggested posts to user
    userPostSuggestions[user_id] = postSuggestions


# Stringify to JSON format and return to nodejs server
print(json.dumps(userPostSuggestions, separators=(',',':')))
sys.stdout.flush()