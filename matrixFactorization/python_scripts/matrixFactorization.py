import numpy as np

class MF:
    """ 
        Factorize matrix R into two lower rank matrices U and V, such that their product approximates R
        U: represents the user's preferences
        V: represents the item's characteristics
    """
    # Constructor
    def __init__(self, R, K=10, lr=0.001, n_iter=1000, tol=0.005):
        self.R = np.array(R) # Relations array (user-item relations)
        self.n_users = len(R)
        self.n_items = len(R[0])
        self.K = K # Number of latent features
        self.lr = lr # Learning rate
        self.n_iter = n_iter # Number of iterations (for training)
        self.tol = tol
        np.random.seed(404)

        # R=MxN, U=MxK, V=KxN
        self.U = np.random.rand(self.n_users, self.K)
        self.V = np.random.rand(self.n_items, self.K)
        print("Matrix factorization initialized")
        self.print()
    
    def print(self):
        print(f"R = users {self.n_users} x {self.n_items} items")
        print(f"Number of latent features: {self.K}")
        print(f"Learning rate: {self.lr}")
        print(f"Number of iterations: {self.n_iter}")

    def predict(self, user_index, item_index):
        return np.dot(self.U[user_index], self.V[item_index].T)

    def calculate_error(self, r, r_hat):
        return np.square(r - r_hat)

    def calculate_gradients(self, r, r_hat, user_index, item_index):
        error = r - r_hat
        du = -2 * error * self.V[item_index]
        dv = -2 * error * self.U[user_index]
        return du, dv

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    # Training function
    def train(self):
        prev_cost = 0
        for iter in range(self.n_iter):
            print(f"------- {iter + 1} -------")
            cost = self.cost_function()
            print(cost)

            for i in range(self.n_users):
                for j in range(self.n_items):
                    r = self.R[i,j]

                    # Skip missing ratings
                    if r == 0:
                        continue

                    r_hat = self.predict(i,j)

                    # Calculate error for current element
                    error = self.calculate_error(r, r_hat)

                    # Calculate gradients
                    dU,dV = self.calculate_gradients(r, r_hat, i, j)

                    # Use gradients to update weights
                    self.U[i, :] -= self.lr * dU
                    self.V[j, :] -= self.lr * dV
            if abs(prev_cost - cost) < self.tol:
                break
            prev_cost = self.cost_function()
            

    def predict_all(self):
        return np.dot(self.U, self.V.T)

    # Mean Squared Error (MSE)
    def cost_function(self):
        R_hat = self.predict_all()
        cost = np.mean(np.square(self.R - R_hat))
        return cost

    def get_suggestions(self, user, user_to_index, index_to_item):

        # Trim self.U to only contain user's connected users
        connected_indices = [user_to_index[user['_id']]]
        for connected_user in user['network']:
            connected_indices.append(user_to_index[connected_user])
        
        trimmedU = []
        for i,features in enumerate(self.U):
            if i in connected_indices:
                trimmedU.append(features)
        
        # Combine values for trimmedU into a single feature array
        combinedU = []
        for feature in trimmedU:
            print(feature)
            combinedU.append(feature)
        
        # make prediction
        job_suggestions = np.dot(combinedU,self.V.T)
        return job_suggestions


    # # Trim U to user's network
    # def trimToNetwork(self, userId, userNetwork, userMappings):
    #     trimmedU = []
    #     for i in range(len(userNetwork) + 1):
    #         trimmedU.append([])

    #     trimmedU[0] = self.U[userMappings[userId]]
    #     for i, connectedUserId in enumerate(userNetwork):
    #         trimmedU[i + 1] = self.U[userMappings[connectedUserId]]

    #     return trimmedU
    
    # def insert_recommendation(self, recommendations, prediction, item, preferences, itemMapping):
    #     i = len(recommendations) - 1
    #     while i >= 0 and preferences[itemMapping[recommendations[i]]] < prediction:
    #         i -= 1
        
    #     recommendations.insert(i + 1, item)

    # # Prediction function
    # def predict(self, userId, userNetwork, itemInteractions, userMappings, itemMapping, flippedItemMapping):
    #     trimmedU = self.trimToNetwork(userId, userNetwork, userMappings)
    #     combinedU = np.mean(trimmedU, axis=0) # collective network latent features
    #     preferences = np.dot(combinedU, self.V.T) # Average preference amongst the user and their connected user, equally influenced by them
    #     # Create recommendations list, for items that score higher than 0.5
    #     recommendations = []
    #     for itemIndex, prediction in enumerate(preferences):
    #         if prediction > 0.5:
    #             item = flippedItemMapping[itemIndex]
    #             if item not in itemInteractions:  # If item is already interacted with, do not insert it in recommendations list
    #                 self.insert_recommendation(recommendations, prediction, item, preferences, itemMapping)

    #     return recommendations