from django.test import TestCase

# Create your tests here.
import datetime

from django.test import TestCase
from django.utils import timezone

from .models import Question
from django.urls import reverse


class QuestionModelTests(TestCase):
    def test_was_published_recently_with_old_question(self):
         
         """was_published_recently() returns False for questions whose pub_date
         is older than 1 day.
         """
         time = timezone.now() - datetime.timedelta(days=1, seconds=1)
         old_question = Question(pub_date=time)
         self.assertIs(old_question.was_published_recently(), False)

    def test_was_published_recently_with_recent_question(self):
         """
         was_published_recently() returns True for questions whose pub_date
         is within the last day.
         """
         time = timezone.now() - datetime.timedelta(hours=23, minutes=59, seconds=59)
         recent_question = Question(pub_date=time)
         self.assertIs(recent_question.was_published_recently(), True)

    def create_question(question_text, days):
         """
         Create a question with the given `question_text` and published the
         given number of `days` offset to now (negative for questions published
         in the past, positive for questions that have yet to be published).
         """
         time = timezone.now() + datetime.timedelta(days=days)
         return Question.objects.create(question_text=question_text,pub_date=days)
    
class QuestionIndexViewTests(TestCase):
     def test_no_questions(self):
          """
                 If no questions exist, an appropriate message is displayed.

          """
          response = self.client.get(reverse('polls:index'))
          self.assertEqual(response.status_code, 200)
          self.assertContains(response, "No polls are available.")
          self.assertQuerysetEqual(response.context['question_list'], [])

