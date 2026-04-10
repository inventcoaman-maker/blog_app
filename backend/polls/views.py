from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse,Http404,HttpResponseRedirect
from .models import Question,Choice
from django.utils import timezone
import datetime
from django.urls import reverse
from django.views import generic



class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'questions_lst'
    
    def get_queryset(self):
         """
         Return the last five published questions (not including those set to be
         published in the future).
         """
         return Question.objects.all(
              ).order_by('-pub_date')
   
   
    
class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'
    # What we have works well; however, even though future questions don’t appear in the index, users can still reach them if they know or guess the right URL. So we need to add a similar constraint to DetailView:
    def get_queryset(self):
        """
        Excludes any questions that aren't published yet.
        """
        return Question.objects.filter(pub_date__lte=timezone.now())


class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

def creating_questions(request):
    # question=Question.objects.all()
    # question.delete()
    
    # first=Question(question_text="this is first question ",pub_date=timezone.now())
    # first.save()
    # second=Question(question_text="this is second question ",pub_date=timezone.now())
    # second.save()
    # third=Question(question_text="this is third question ",pub_date=timezone.now())
    # third.save()
    # four=Question(question_text="this is third question ",pub_date=timezone.now())
    # four.save()
    # five=Question(question_text="this is third question ",pub_date=timezone.now())
    # five.save()
    # first_choice=first.choice_set.create(choice_text="car",)
    # all = Question.objects.all()
    # all.delete()

    # first_q=Question.objects.get(pk=1)
    # first_choice=first_q.choice_set.create(choice_text="car",votes=0)
    # first_choice=first_q.choice_set.create(choice_text="bike",votes=0)
    # first_choice=first_q.choice_set.create(choice_text="truck",votes=0)

    # sec_q=Question.objects.get(pk=2)
    
    # sec_q=sec_q.choice_set.create(choice_text="red",votes=0)
    # sec_q=sec_q.choice_set.create(choice_text="pink",votes=0)
    # sec_q=sec_q.choice_set.create(choice_text="blue",votes=0)

    # third_q=Question.objects.get(pk=3)
    # third_q=third_q.choice_set.create(choice_text="red",votes=0)
    # third_q=third_q.choice_set.create(choice_text="pink",votes=0)
    # third_q=third_q.choice_set.create(choice_text="blue",votes=0)

    # fourth_q=Question.objects.get(pk=4)
    # fourth_q=fourth_q.choice_set.create(choice_text="red",votes=0)
    # fourth_q=fourth_q.choice_set.create(choice_text="pink",votes=0)
    # fourth_q=fourth_q.choice_set.create(choice_text="blue",votes=0)

    # fifth_q=Question.objects.get(pk=5)
    # fifth_q=fifth_q.choice_set.create(choice_text="red",votes=0)
    # fifth_q=fifth_q.choice_set.create(choice_text="pink",votes=0)
    # fifth_q=fifth_q.choice_set.create(choice_text="blue",votes=0)

#     x=Question.objects.get(pk=2)
#     x.choice_set.delete()


    


# x=Question.objects.get(pk=3)
# x.choice_set.all().delete()
# x.choice_set.create(choice_text="g",votes=0)




    # x=Question.objects.all()
    # x.delete()
    # q.question_text="just new whyy"
    # q.save()
    # x=Question.objects.all().values()
    # print(type(x))
    # print(x[0]["question_text"])
    # x= Question.objects.filter(id=1)
    # x=Question.objects.filter(question_text__istartswith="new")
    # x = timezone.now().date()
    # y=Question.objects.filter(pub_date=x)
    # x=Question.objects.get(pk=48)
    # first=Question.objects.get(pk=1)
    # two=Question.objects.get(pk=2)
    # three=Question.objects.get(pk=3)
    # four=Question.objects.get(pk=4)

    # print(x.choice_set.delete())
    # q=x.choice_set.create(choice_text='python', votes=0)
    # q.delete()

    # x.choice_set.create(choice_text='c', votes=0)
    # x.choice_set.create(choice_text='java', votes=0)

    # first.choice_set.create(choice_text='black', votes=0)
    # first.choice_set.create(choice_text='red', votes=0)
    # first.choice_set.create(choice_text='blue', votes=0)

    # two.choice_set.create(choice_text='bike', votes=0)
    # two.choice_set.create(choice_text='car', votes=0)
    # two.choice_set.create(choice_text='truck', votes=0)


    # three.choice_set.create(choice_text='india', votes=0)
    # three.choice_set.create(choice_text='usa', votes=0)
    # three.choice_set.create(choice_text='japan', votes=0)


    # x.choice_set.create(choice_text='Just hacking again', votes=0)
    # p=c.question_text
    # y=x.choice_set.all()
    # print(y)
    # print(x)      
    return HttpResponse("hello")

# def detail(request,question_id):
#     try:
#         question=Question.objects.get(pk=question_id)
#     except Question.DoesNotExist:
#         raise Http404("question does not exist")
#     return render(request,"polls/detail.html",{"question":question})


# def results(request, question_id):
#     response = "You're looking at the results of question %s."
#     question=Question.objects.get(pk=question_id)
#     context={
#         "question":question
#     }
#     return render(request,"polls/results.html",context)

def vote(request, question_id):
    question=get_object_or_404(Question,pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
        print(selected_choice)
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': question,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
    return HttpResponse("You're voting on question %s." % question_id)

def index(request,):
    questions=list(Question.objects.all()[:5].values())
    # question_item=[item for item in questions ]
    # new_items_lst=[]
    # for i in questions:
    #     new_items_lst.append(i["question_text"])
    # # print(question_item)
    # print(new_items_lst)

    context={
        "questions_lst":questions
    }
    return render(request,"polls/index.html",context)
    return HttpResponse("hello")


