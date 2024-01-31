#importing dependencies

import numpy as np 
import pandas as pd
import re #regular expression used for pattern matching or search through the data
from nltk.corpus import stopwords #natural language toolkit
from nltk.stem.porter import PorterStemmer#to reduce a word to its root word 
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

import nltk
nltk.download('stopwords')

#Data Processing
twitter_data=pd.read_csv('/content/training.1600000.processed.noemoticon.csv',encoding='ISO-8859-1')

#checking no of rows and columns 
twitter_data.shape

twitter_data.head()

#naming the columns and reading dataset again 

column_names=['target','id','date','flag','user','text']
twitter_data=pd.read_csv('/content/training.1600000.processed.noemoticon.csv',names=column_names,encoding='ISO-8859-1')

#counting no of missing values 
twitter_data.isnull().sum()

#checking the distribution of target column 
twitter_data['target'].value_counts()
#0=neg
#4=pos

#Convert data from 4 to 1 for pos
twitter_data.replace({'target':{4:1}},inplace=True)

#stemming is a process to reduce a word to a root word 
#example:-actor,actress,acting=act
port_stem=PorterStemmer()

def stemming(content):
  stemmed_content=re.sub('[^a-zA-Z]',' ',content)
  stemmed_content=stemmed_content.lower()
  stemmed_content=stemmed_content.split()
  stemmed_content=[port_stem.stem(word) for word in stemmed_content if not word in stopwords.words('english')]
  stemmed_content=' '.join(stemmed_content)
  return stemmed_content

twitter_data['stemmed_content']=twitter_data['text'].apply(stemming)

twitter_data.head()

print(twitter_data['stemmed_content'])

#separating the data and label 
x=twitter_data['stemmed_content'].values
y=twitter_data['target'].values

#Split the data into training and testing
X_train , X_test ,Y_train ,Y_test =train_test_split(x,y,test_size=0.2,stratify=y,random_state=2)
#test_size=0.2 means 20% will be test data and 0.8 means 80% will be train data 
#stratify y means i want an equal distribution of 0 and 1 of y into training and testing if not specified it will lead to all 0 in test or train or vice versa 
#random state i used to split data in diff ways if we specify 2 and other also specify 2 your and there split will be same 


#converting textual data to numerical data 
vectorizer=TfidfVectorizer()

X_train=vectorizer.fit_transform(X_train)#here fit means observing nature of data and then tranforming it into numerics 

X_test=vectorizer.transform(X_test)

#Here it analyses all pos and neg sentence and assigns each word some importance and divides it into pos or neg word 

#Training the model 
#Logistic Regression
model=LogisticRegression(max_iter=1000)

model.fit(X_train,Y_train)

#Model Evaluation with accuracy score

X_train_prediction=model.predict(X_train)
training_data_accuracy=accuracy_score(Y_train,X_train_prediction)
print(training_data_accuracy)
X_test_prediction=model.predict(X_test);
test_data_accuracy=accuracy_score(Y_test,X_test_prediction)
#Saving the trained modell
import pickle
filename='trained_model.sav'
pickle.dump(model,open(filename,'wb'))

#Using the saved model for future prediction
loaded_model=pickle.load(open('/content/trained_model.sav','rb'))
X_new=X_test[200]


print(Y_test[200])

prediction=model.predict(X_new)
print(prediction)

if(prediction[0]==0):
  print('Negative Tweet')
else:
  print('Positive Tweet')