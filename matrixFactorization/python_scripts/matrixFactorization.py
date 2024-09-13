import numpy as np
import pickle

class MF:
    """ 
        Factorize matrix R into two lower rank matrices U and V, such that their product approximates R
        U: represents the user's preferences
        V: represents the item's characteristics
    """
    # Constructor
    def __init__(self, R, K=60, lr=0.001, n_iter=1000, tol=0.005, reg_param=0.001):
        self.R = np.array(R) # Relations array (user-item relations)
        self.n_users = len(R)
        self.n_items = len(R[0])
        self.K = K # Number of latent features
        self.lr = lr # Learning rate
        self.n_iter = n_iter # Number of iterations (for training)
        self.tol = tol
        self.reg_param = reg_param
        np.random.seed(404)

        # R=MxN, U=MxK, V=KxN
        self.U = np.random.uniform(low=0.1, high=1.0, size=(self.n_users, self.K))
        self.V = np.random.uniform(low=0.1, high=1.0, size=(self.n_items, self.K))
        # print("Matrix factorization initialized")
        # self.print()
    
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
        du = - 2 * (error * self.V[item_index] - self.reg_param * self.U[user_index])
        dv = - 2 * (error * self.U[user_index] - self.reg_param * self.V[item_index])
        return du, dv

    # Training function
    def train(self, no_output = False):
        prev_cost = 0
        for iter in range(self.n_iter):
            if not no_output:
                print(f"------- {iter + 1} -------")
            cost = self.cost_function()
            if not no_output:
                print(cost)

            for i in range(self.n_users):
                for j in range(self.n_items):
                    r = self.R[i,j]

                    # Skip missing ratings
                    if r <= 0:
                        continue

                    r_hat = self.predict(i,j)

                    # Calculate gradients
                    dU,dV = self.calculate_gradients(r, r_hat, i, j)

                    # Use gradients to update weights
                    self.U[i, :] -= self.lr * dU
                    self.V[j, :] -= self.lr * dV
            if abs(prev_cost - cost) < self.tol:
                break
            prev_cost = cost
            self.lr = self.lr * 0.99 # small learning rate decay
            

    def predict_all(self):
        return np.dot(self.U, self.V.T)

    # Mean Squared Error (MSE)
    def cost_function(self):
        R_hat = self.predict_all()
        mask = self.R > 0
        mse = np.mean(np.square(self.R[mask] - R_hat[mask]))
        reg = self.reg_param * (np.sum(np.square(self.U)) + np.sum(np.square(self.V)))
        return mse + reg

    def recommend(self, user_index, top_n):

        full_matrix = self.predict_all()
        user_row = full_matrix[user_index]
        item_recommendations = []
        for i,item in enumerate(user_row):
            if item >= 1:
                item_recommendations.append((i,item))
        
        # Sort based on item and return indices
        item_recommendations.sort(key=lambda x: x[1], reverse=True)
        # print(item_recommendations) # print scores
        # Return indices, sorted
        returned_list = [a for a,b in item_recommendations]
        return returned_list[:top_n]
    

    def save(self, path):
        with open(path + ".pkl", "wb") as file:
            pickle.dump(self, file)
        # print(f"Object saved to {path}.pkl")
    
    @staticmethod
    def load(filename):
        with open(filename + ".pkl", "rb") as file:
            # print(f"Object loaded successfuly from {filename}.pkl")
            return pickle.load(file)