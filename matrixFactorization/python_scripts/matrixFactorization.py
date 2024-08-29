import numpy as np

class MF:
    """ 
        Factorize matrix R into two lower rank matrices U and V, such that their product approximates R
        U: represents the user's preferences
        V: represents the item's characteristics
    """
    # Constructor
    def __init__(self, R, K=10, lr=0.01, alpha=0.01, n_iter=100, e_threshold=0.05):
        self.R = R # Relations array (user-item relations)
        self.n_users = len(R)
        self.n_items = len(next(iter(R.values())))
        if self.n_users <= 0 or self.n_items <= 0:
            print("Error: number of users/items is not valid")
            return
        self.K = K # Number of latent features
        self.lr = lr # Learning rate
        self.alpha = alpha # Regularization parameter
        self.n_iter = n_iter # Number of iterations (for training)
        self.e_threshold = e_threshold # Error threshold
        self.U = np.random.rand(self.n_users, self.K)
        self.V = np.random.rand(self.n_items, self.K)

    # Training function
    def train(self):
        print("Starting training routine")

        for iter in range(self.n_iter):
            print(f"-------------- Iteration {iter}")
            for i in range(len(self.R)):
                for j in range(len(self.R[i])):
                    if self.R[i][j] > 0:
                        
                        # Element error (rating - predictied rating)
                        error = self.R[i][j] - np.dot(self.U[i,:], self.V[j,:].T)

                        # Compute the gradient and update U and V
                        self.U[i, :] += self.lr * (2 * error * self.V[j, :] - self.alpha * self.U[i, :])
                        self.V[j, :] += self.lr * (2 * error * self.U[i, :] - self.alpha * self.V[j, :])

            # Compute cost for this iteration
            cost = self.cost_function()
            print(f"\tcost:{cost}\n")
            if cost < self.e_threshold:
                break

    # Error function
    def cost_function(self):
        print("Calculating error")

        # Make prediction
        predicted = np.dot(self.U, self.V.T)

        # Calculate Mean Squared Error
        MSE = np.square(np.subtract(self.R, predicted)).mean()

        # Regularize the cost
        cost = MSE + self.alpha * (np.sum(np.square(self.U)) + np.sum(np.square(self.V)))
        return cost

    # Trim U to user's network
    def trimToNetwork(self, userId, userNetwork, userMappings):
        trimmedU = np.zeros(len(userNetwork) + 1)

        trimmedU[0] = self.U[userMappings[userId]]
        for i, connectedUserId in enumerate(userNetwork):
            trimmedU[i + 1] = self.U[userMappings[connectedUserId]]
        
        return trimmedU
    
    def insert_recommendation(recommendations, prediction, item, preferences, itemMapping):
        i = len(recommendations) - 1
        while i >= 0 and preferences[itemMapping[recommendations[i]]] < prediction:
            i -= 1
        
        recommendations.insert(i + 1, item)

    # Prediction function
    def predict(self, userId, userNetwork, itemInteractions, userMappings, itemMapping, flippedItemMapping):
        trimmedU = self.trimToNetwork(userId, userNetwork, userMappings)
        combinedU = np.mean(trimmedU, axis=0) # collective network latent features
        preferences = np.dot(combinedU, self.V.T) # Average preference amongst the user and their connected user, equally influenced by them
        
        # Create recommendations list, for items that score higher than 0.5
        recommendations = []
        for itemIndex, prediction in enumerate(preferences):
            if prediction > 0.5:
                item = flippedItemMapping[itemIndex]
                if item not in itemInteractions:  # If item is already interacted with, do not insert it in recommendations list
                    self.insert_recommendation(recommendations, prediction, item, preferences, itemMapping)

        return recommendations