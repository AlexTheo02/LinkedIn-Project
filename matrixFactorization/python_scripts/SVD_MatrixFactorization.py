import numpy as np
import pickle

class SVD_MF:

    def __init__(self, R, K=40, lr=0.001, reg_param=0.001, n_iter=1000, tol=1e-4):
        self.R = np.array(R) # Relations array (user-item relations)
        self.n_users, self.n_items = self.R.shape
        self.K = K # Number of factors
        self.lr = lr # Learning rate
        self.n_iter = n_iter # Number of iterations (for training)
        self.reg_param = reg_param
        self.tol = tol
        np.random.seed(404)

        # SVD initialization (CHECK INITIALIZATION AND OPTIMIZE ERROR AND TRAINING FUNCTIONS)

        # HERE,, ERROR HERE
        # self.U = np.random.normal(scale=1./self.K, size=(self.n_users,self.K))
        # self.V = np.random.normal(scale=1./self.K, size=(self.n_items,self.K))
        # self.Sigma = np.random.normal(scale=1./self.K, size=self.K)

        self.U = np.random.uniform(low=0.1, high=1.0, size=(self.n_users, self.K))
        self.V = np.random.uniform(low=0.1, high=1.0, size=(self.n_items, self.K))
        self.Sigma = np.random.uniform(low=0.1, high=1.0, size=self.K)


    def train(self, no_output=False):
        prev_error = float("inf")
        for iter in range(self.n_iter):
            for i in range(self.n_users):
                for j in range(self.n_items):
                    # Only account non-zero interactions
                    if self.R[i,j] > 0:
                        eij = self.R[i,j] - self.predict(i,j)

                        # Update U,Σ,V using gradient descent
                        for k in range(self.K):
                            u_i_k = self.U[i,k]
                            v_j_k = self.V[j,k]

                            # Gradient updates for U,Σ,V
                            grad_U = eij * self.Sigma[k] * v_j_k - self.reg_param * u_i_k
                            grad_V = eij * self.Sigma[k] * u_i_k - self.reg_param * v_j_k
                            grad_Sigma = eij * u_i_k * v_j_k - self.reg_param * self.Sigma[k]

                            self.U[i,k] += self.lr * (eij * self.Sigma[k] * v_j_k - self.reg_param * u_i_k)

                            self.V[j,k] += self.lr * (eij * self.Sigma[k] * u_i_k - self.reg_param * v_j_k)

                            self.Sigma[k] += self.lr * (eij * u_i_k * v_j_k - self.reg_param * self.Sigma[k])

            rmse = self._rmse()
            if not no_output:
                print(f"Iteration: {iter+1}: Error: {rmse}")

            if abs(rmse - prev_error) < self.tol:
                break
            prev_error = rmse
    

    def predict(self, i,j):
        return np.dot(np.dot(self.U[i,:], np.diag(self.Sigma)), self.V[j, :])

    def full_matrix(self):
        return np.dot(np.dot(self.U, np.diag(self.Sigma)), self.V.T)

    def _rmse(self):
        # Compute the mean squared error of non-zero interactions in R
        predicted = self.full_matrix()
        mask = self.R > 0  # Mask to consider only non-zero interactions
        error = np.square(self.R[mask] - predicted[mask])
        rmse = np.sqrt(np.sum(error) / np.sum(mask))
        return rmse

    # Return job indices
    def recommend(self, user_index):
        full_matrix = self.full_matrix()
        user_row = full_matrix[user_index]
        item_recommendations = []
        for i,item in enumerate(user_row):
            if item > 0.5:
                item_recommendations.append((i,item))
        
        # Sort based on item and return indices
        item_recommendations.sort(key=lambda x: x[1], reverse=True)
        # print(item_recommendations) # print scores
        # Return indices, sorted
        returned_list = [a for a,_ in item_recommendations]
        return returned_list
    
    def save(self, path):
        with open(path + ".pkl", "wb") as file:
            pickle.dump(self, file)
        print(f"Object saved to {path}")
    
    @staticmethod
    def load(filename):
        with open(filename + ".pkl", "rb") as file:
            print(f"Object loaded successfuly from {filename + "pkl"}")
            return pickle.load(file)